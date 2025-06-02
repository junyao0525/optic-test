import { useNavigation } from '@react-navigation/native';
import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Platform } from 'react-native';
import { Camera, PhotoFile } from 'react-native-vision-camera';
import { useDetectFaceAPI } from '../api/python';
import { ColorProps } from '../themes';

type DistanceMeasureContextType = {
  cameraRef: React.MutableRefObject<Camera | null>;
  isMeasuring: boolean;
  headDistance: number | null;
  faceCount: number;
  distanceText: string;
  secondsRemaining: number;
  color: ColorProps;
  startCapture: () => void;
};

const DistanceMeasureContext = createContext<
  DistanceMeasureContextType | undefined
>(undefined);

export const useDistanceMeasure = () => {
  const context = useContext(DistanceMeasureContext);
  if (!context) {
    throw new Error(
      'useDistanceMeasure must be used within a DistanceMeasureProvider',
    );
  }
  return context;
};

export const DistanceMeasureProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const cameraRef = useRef<Camera | null>(null);
  const capturingRef = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const secondsRef = useRef<number>(10);
  const {t} = useTranslation();

  const {mutateAsync: detectFaceMutateAsync} = useDetectFaceAPI();

  const [isMeasuring, setIsMeasuring] = useState(false);
  const [headDistance, setHeadDistance] = useState<number | null>(null);
  const [faceCount, setFaceCount] = useState<number>(0);
  const [distanceText, setDistanceText] = useState<string>('');
  const [secondsRemaining, setSecondsRemaining] = useState<number>(10);
  const [color, setColor] = useState<ColorProps>('black');
  const navigation = useNavigation();

  const capturePhoto = async (): Promise<boolean> => {
    if (!cameraRef.current || capturingRef.current) return false;
    capturingRef.current = true;

    try {
      const photo: PhotoFile = await cameraRef.current.takePhoto({
        flash: 'off',
        enableShutterSound: false,
      });

      const formData = new FormData();
      formData.append('file', {
        uri: Platform.OS === 'ios' ? photo.path : `file://${photo.path}`,
        type: 'image/jpeg',
        name: 'photo.jpg',
      } as any);

      const response = await detectFaceMutateAsync(formData);

      if (response.face_count !== 1 || !response.faces[0].is_centered) {
        Alert.alert(
          t('distance_measurement.alerts.invalid_position.title'),
          t('distance_measurement.alerts.invalid_position.message'),
        );
        return false;
      }

      const distance = response.faces[0].distance_cm;
      setHeadDistance(distance);
      setFaceCount(1);

      if (response.faces[0].is_too_near) {
        setDistanceText(t('distance_measurement.messages.too_close'));
        setColor('red');
        Alert.alert(
          t('distance_measurement.alerts.too_close.title'),
          t('distance_measurement.alerts.too_close.message'),
        );
      } else if (response.faces[0].is_too_far) {
        setDistanceText(t('distance_measurement.messages.too_far'));
        Alert.alert(
          t('distance_measurement.alerts.too_far.title'),
          t('distance_measurement.alerts.too_far.message'),
        );
        setColor('orange');
      } else {
        setDistanceText(t('distance_measurement.messages.perfect'));
        setColor('green');
        Alert.alert(
          t('distance_measurement.alerts.perfect.title'),
          t('distance_measurement.alerts.perfect.message'),
        );
        return true;
      }
    } catch (e) {
      Alert.alert(
        t('distance_measurement.alerts.error.title'),
        t('distance_measurement.alerts.error.message'),
      );
    } finally {
      capturingRef.current = false;
    }

    return false;
  };

  const stopCapture = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsMeasuring(false);
  };

  const startCapture = () => {
    if (intervalRef.current) return;

    setIsMeasuring(true);
    secondsRef.current = 10;
    setSecondsRemaining(10);
    setDistanceText('');
    setFaceCount(0);
    setHeadDistance(null);

    intervalRef.current = setInterval(async () => {
      let response = false;
      try {
        response = await capturePhoto();
      } catch (err) {
        console.error('Capture failed:', err);
      }

      secondsRef.current -= 1;
      setSecondsRemaining(secondsRef.current);

      const timeout = secondsRef.current <= 0;
      const success = response;

      if (success || timeout) {
        setTimeout(() => {
          stopCapture();

          if (timeout && !success) {
            Alert.alert(
              t('distance_measurement.alerts.timeout.title'),
              t('distance_measurement.alerts.timeout.message'),
              [
                {
                  text: t('common.cancel'),
                  onPress: () => navigation.goBack(),
                  style: 'destructive',
                },
                {
                  text: t('common.continue'),
                  onPress: () => {
                    console.log('Restarting measurement...');
                    startCapture();
                  },
                },
              ],
            );
          }
        }, 500);
      }
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <DistanceMeasureContext.Provider
      value={{
        cameraRef,
        isMeasuring,
        headDistance,
        faceCount,
        distanceText,
        secondsRemaining,
        color,
        startCapture,
      }}>
      {children}
    </DistanceMeasureContext.Provider>
  );
};
