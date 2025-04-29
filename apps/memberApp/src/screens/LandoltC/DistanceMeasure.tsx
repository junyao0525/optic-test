import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Camera, PhotoFile} from 'react-native-vision-camera';
import CameraProvider, {useCameraContext} from '../../../hocs/CameraProvider';
import {useUploadFile} from '../../api/file';
import {useDetectFaceAPI} from '../../api/python';
import {Colors, TextStyle} from '../../themes';

const MIN_DISTANCE = 40;
const MAX_DISTANCE = 70;

interface FaceDetectionResponse {
  face_count: number;
  distances_cm?: number[];
  raw_output?: any;
  error?: string;
  message?: string;
}

const DistanceMeasure: React.FC = () => {
  const camera = useRef<Camera | null>(null);
  const {loaded, cameraPermission, activeDevice} = useCameraContext();
  const isActiveRef = useRef<boolean>(true);
  const capturingRef = useRef<boolean>(false);
  const [headDistance, setHeadDistance] = useState<number | null>(null);
  const [isMeasuring, setIsMeasuring] = useState<boolean>(true);
  const [faceCount, setFaceCount] = useState<number>(0);
  const navigation = useNavigation();
  const {mutateAsync: detectFaceMutateAsync} = useDetectFaceAPI();
  const {mutateAsync: uploadFileMutateAsync} = useUploadFile();
  const [cameraReady, setCameraReady] = useState(false);
  const [faces, setFaces] = useState<
    Array<{x: number; y: number; width: number; height: number}>
  >([]);

  const capturePhoto = async (): Promise<void> => {
    if (
      !camera.current ||
      capturingRef.current ||
      !activeDevice ||
      !cameraReady
    )
      return;

    capturingRef.current = true;

    try {
      console.log('Taking photo...');

      const photo: PhotoFile = await camera.current.takePhoto({
        flash: 'off',
        enableShutterSound: false,
      });

      console.log('Photo captured:', photo.path);

      // 2. Create FormData object for API request
      const formData = new FormData();
      formData.append('file', {
        uri: Platform.OS === 'ios' ? photo.path : `file://${photo.path}`,
        type: 'image/jpeg',
        name: 'photo.jpg',
      } as any);

      // 3. Send photo to backend for face detection
      console.log('Sending photo to API...');
      const response = (await detectFaceMutateAsync(
        formData,
      )) as FaceDetectionResponse & {
        faces?: {x: number; y: number; width: number; height: number}[];
      };
      console.log('Face detection response:', response);

      // 4. Process face detection results
      if (response?.face_count !== undefined) {
        setFaceCount(response.face_count);
        setFaces(response.faces || []);

        if (response.face_count > 0 && response.distances_cm?.length) {
          const distance = response.distances_cm[0];
          setHeadDistance(distance);
          setIsMeasuring(false);

          // Check if distance is within acceptable range
          if (distance < MIN_DISTANCE) {
            Alert.alert('Too Close', 'Please move farther from the camera');
          } else if (distance > MAX_DISTANCE) {
            Alert.alert('Too Far', 'Please move closer to the camera');
          } else {
            Alert.alert('Perfect Distance', 'Your distance is ideal!');
          }
        }
      }
    } catch (error) {
      console.error('Photo capture/upload error:', error);
      Alert.alert(
        'Error',
        'Failed to capture or process photo. Please try again.',
      );
    } finally {
      capturingRef.current = false;
    }
  };

  // Set up interval for continuous measurements
  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    if (cameraPermission === 'denied') {
      handlePermissionDenied();
    } else if (
      cameraPermission === 'granted' &&
      camera.current &&
      loaded &&
      activeDevice
    ) {
      // Initial capture
      capturePhoto();

      // Set up interval for continuous measurement
      intervalId = setInterval(capturePhoto, 1000);
      console.log('Photo capture interval set up');
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        console.log('Cleared photo capture interval');
      }
    };
  }, [cameraPermission, loaded, activeDevice, cameraReady]);

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

  const renderDistanceMessage = (): React.ReactNode => {
    if (headDistance === null) return null;

    let message = '';
    let color = Colors.black;

    if (headDistance < MIN_DISTANCE) {
      message = 'Too close! Please move back.';
      color = Colors.red;
    } else if (headDistance > MAX_DISTANCE) {
      message = 'Too far! Please move closer.';
      color = Colors.orange;
    } else {
      message = 'Perfect distance!';
      color = Colors.green;
    }

    return (
      <View style={styles.distanceMessageContainer}>
        <Text style={[styles.distanceText, {color}]}>{message}</Text>
        <Text style={styles.distanceValue}>
          Distance: {headDistance.toFixed(1)} cm
        </Text>
        {faceCount > 0 && (
          <Text style={styles.faceCountText}>Faces detected: {faceCount}</Text>
        )}
      </View>
    );
  };

  if (!activeDevice) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Front camera not available</Text>
      </SafeAreaView>
    );
  }

  if (cameraPermission !== 'granted') {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Camera permission is required.</Text>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={[TextStyle.H3, styles.text]}>
          {headDistance === null
            ? 'Hold your device and match your face within the circle and sit in a well-lit room.'
            : 'Distance measured successfully'}
        </Text>
      </View>

      <View style={styles.cameraContainer}>
        <Camera
          ref={camera}
          style={StyleSheet.absoluteFill}
          device={activeDevice}
          isActive={isActiveRef.current}
          photo={true}
          onInitialized={() => {
            console.log('Camera initialized');
            setCameraReady(true);
          }}
          onError={error => {
            console.error('Camera initialization error', error);
          }}
        />

        <View style={styles.faceGuide} />
      </View>

      <View style={styles.statusContainer}>
        {isMeasuring && (
          <View style={styles.measureTextContainer}>
            <ActivityIndicator color={Colors.primary} />
            <Text style={styles.measuringText}>Measuring...</Text>
          </View>
        )}
        {renderDistanceMessage()}
      </View>
    </View>
  );
};

const DistanceMeasureWithProvider: React.FC = () => {
  return (
    <CameraProvider>
      <DistanceMeasure />
    </CameraProvider>
  );
};

export default DistanceMeasureWithProvider;

const styles = StyleSheet.create({
  faceBox: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'lime',
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  textContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
    color: Colors.black,
  },
  cameraContainer: {
    flex: 2,
    backgroundColor: 'black',
    position: 'relative',
  },
  statusContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
  },
  measureTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 10,
  },
  measuringText: {
    fontSize: 18,
    color: Colors.black,
  },
  distanceMessageContainer: {
    alignItems: 'center',
    padding: 10,
  },
  distanceText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  distanceValue: {
    fontSize: 16,
    textAlign: 'center',
    color: Colors.black,
  },
  faceCountText: {
    fontSize: 14,
    textAlign: 'center',
    color: Colors.black,
    marginTop: 5,
  },
  errorText: {
    fontSize: 18,
    color: Colors.black,
    textAlign: 'center',
    padding: 20,
  },
  faceGuide: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    transform: [{translateX: -110}, {translateY: -110}],
  },
});
