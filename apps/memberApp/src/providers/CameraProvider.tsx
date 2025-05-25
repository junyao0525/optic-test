import {useNavigation} from '@react-navigation/native';
import {DetectFaceApi} from '@vt/core/apis/app/python';
import React, {
  createContext,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {Alert, Linking, Platform} from 'react-native';
import {
  Camera,
  CameraDevice,
  CameraPermissionStatus,
  PhotoFile,
} from 'react-native-vision-camera';
import {useDetectFaceAPI} from '../api/python';

// Define the shape of the context value
export type CameraContextValue = {
  cameraPermission: CameraPermissionStatus | null;
  loaded: boolean;
  devices: CameraDevice[] | null;
  activeDevice: CameraDevice | null;
  cameraRef: React.RefObject<Camera> | null;
  isActiveRef: React.RefObject<boolean>;
  capturingRef: React.RefObject<boolean>;
  faceData: DetectFaceApi['Response'];
  setFaceData: React.Dispatch<React.SetStateAction<DetectFaceApi['Response']>>;
  setActiveDevice: (device: CameraDevice) => void;
  capturePhoto: () => Promise<boolean>;
};

// Initial state for the context
const initialState: CameraContextValue = {
  cameraPermission: null,
  loaded: false,
  devices: null,
  activeDevice: null,
  cameraRef: null,
  isActiveRef: {current: true},
  capturingRef: {current: false},
  faceData: {
    faceCount: 0,
    faceCoordinates: [],
    faceLandmarks: [],
  } as unknown as DetectFaceApi['Response'],
  capturePhoto: async () => false,
  setFaceData: () => {},
  setActiveDevice: () => {},
};

// Create the context
const cameraContext = createContext<CameraContextValue>({...initialState});

const CameraProvider = ({children}: {children: React.ReactNode}) => {
  const [cameraPermission, setCameraPermission] =
    useState<CameraPermissionStatus>('not-determined');
  const [loaded, setLoaded] = useState(false);
  const [devices, setDevices] = useState<CameraDevice[] | null>(null);
  const [activeDevice, setActiveDevice] = useState<CameraDevice | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  const isActiveRef = useRef<boolean>(true);
  const capturingRef = useRef<boolean>(false);
  const [faceData, setFaceData] = useState<DetectFaceApi['Response']>({
    faceCount: 0,
    faceCoordinates: [],
    faceLandmarks: [],
  } as unknown as DetectFaceApi['Response']);

  const navigation = useNavigation();
  const {mutateAsync: detectFaceMutateAsync} = useDetectFaceAPI();

  const handlePermissionDenied = (): void => {
    Alert.alert(
      'Permission Denied',
      'Camera access is denied. Please enable it in settings.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => navigation.goBack(),
        },
        {
          text: 'Open Settings',
          onPress: () => Linking.openSettings(),
        },
      ],
    );
  };

  const capturePhoto = async () => {
    if (!cameraRef.current || capturingRef.current || !activeDevice) {
      return false;
    }

    capturingRef.current = true;
    try {
      console.log('Taking photo...');

      const photo: PhotoFile = await cameraRef.current.takePhoto({
        flash: 'off',
        enableShutterSound: false,
      });

      const formData = new FormData();
      formData.append('file', {
        uri: Platform.OS === 'ios' ? photo.path : `file://${photo.path}`,
        type: 'image/jpeg',
        name: 'photo.jpg',
      } as Partial<PhotoFile>);

      const response = await detectFaceMutateAsync(formData);
      console.log('Face detection response:', response);
      setFaceData(response);
      return true;
    } catch (error) {
      console.error('Error capturing photo:', error);
      return false;
    }
  };

  useLayoutEffect(() => {
    const requestPermissionsAndDevices = async () => {
      try {
        const cameraStatus = await Camera.requestCameraPermission();
        setCameraPermission(cameraStatus);

        if (cameraStatus === 'granted') {
          const availableDevices = await Camera.getAvailableCameraDevices();
          setDevices(availableDevices);
          const frontCamera = availableDevices.find(
            device => device.position === 'front',
          );

          if (frontCamera) {
            setActiveDevice(frontCamera);
          }
        } else {
          handlePermissionDenied();
        }

        setLoaded(true);
      } catch (error) {
        console.error('Failed to request permissions or fetch devices:', error);
        setLoaded(false);
      }
    };
    requestPermissionsAndDevices();
  }, []);

  return (
    <cameraContext.Provider
      value={{
        cameraPermission,
        loaded,
        devices,
        activeDevice,
        cameraRef,
        isActiveRef,
        capturingRef,
        faceData,
        setFaceData,
        setActiveDevice,
        capturePhoto,
      }}>
      {children}
    </cameraContext.Provider>
  );
};

export const useCameraContext = () => useContext(cameraContext);

export default CameraProvider;
