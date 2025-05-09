import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
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
import { Camera, PhotoFile } from 'react-native-vision-camera';
import CameraProvider, { useCameraContext } from '../../../hocs/CameraProvider';
import { useDetectFaceAPI } from '../../api/python';
import BottomButton from '../../components/BottomButton';
import { Colors, TextStyle } from '../../themes';

// TODO : when the result is last second occur the result is not showing
// TODO : add the toasty message

const MIN_DISTANCE = 21;
const MAX_DISTANCE = 45;

const DistanceMeasure: React.FC = () => {
  const cameraRef = useRef<Camera | null>(null);
  const isActiveRef = useRef<boolean>(true);
  const capturingRef = useRef<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const secondsRef = useRef<number>(10);

  const {loaded, cameraPermission, activeDevice} = useCameraContext();

  const [isMeasuring, setIsMeasuring] = useState(false);
  const [headDistance, setHeadDistance] = useState<number | null>(null);
  const [isTooNear, setTooNear] = useState(false);
  const [isTooFar, setTooFar] = useState(false);
  const [isPerfectDistance, setIsPerfectDistance] = useState(false);
  const [faceCount, setFaceCount] = useState<number>(0);
  const [distanceText, setDistanceText] = useState<string>('');
  const [secondsRemaining, setSecondsRemaining] = useState(10);

  const navigation = useNavigation();
  const {mutateAsync: detectFaceMutateAsync} = useDetectFaceAPI();

  const capturePhoto = async (): Promise<boolean> => {
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

      if (response.face_count === 0) {
        Alert.alert('Error', 'No faces detected. Please try again.');
        return false;
      }

      if (response.face_count >= 2) {
        Alert.alert('Error', 'Multiple faces detected. Please try again.');
        return false;
      }

      if (response.face_count !== 0 &&  response.faces[0].is_centered) {
        if (!response.faces[0].is_centered) {
          Alert.alert('Error', 'Face is not Center. Please try again.');
          return false;
        }

        // Update face count state
        setFaceCount(response.face_count);

        if (response.face_count === 1) {
          const distance = response.faces[0].distance_cm;

          if (distance == null) {
            console.error('Distance not found in the response:', response);
            return false;
          }

          console.log('Distance:', distance);
          
          // Update all states at once to prevent multiple re-renders
          const updates = {
            headDistance: distance,
            isTooNear: response.faces[0].is_too_near,
            isTooFar: response.faces[0].is_too_far,
            isPerfectDistance: !response.faces[0].is_too_near && !response.faces[0].is_too_far
          };

          // Batch state updates
          setHeadDistance(updates.headDistance);
          setTooNear(updates.isTooNear);
          setTooFar(updates.isTooFar);
          setIsPerfectDistance(updates.isPerfectDistance);

          if (updates.isTooNear) {
            Alert.alert('Too Close', 'Please move farther from the camera');
            return false;
          } else if (updates.isTooFar) {
            Alert.alert('Too Far', 'Please move closer to the camera');
            return false;
          } else if (updates.isPerfectDistance) {
            Alert.alert('Perfect Distance', 'Your distance is ideal!');

            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
              console.log('Capture interval cleared - valid distance reached');
            }
            return true;
          }
        }
      }
    } catch (error) {
      console.error('Photo capture/upload error:', error);
      Alert.alert(
        'Error',
        'Failed to capture or process photo. Please try again.',
      );
      return false;
    } finally {
      capturingRef.current = false;
    }
    return false;
  };

  const startCapture = () => {
    if (cameraPermission === 'denied') {
      handlePermissionDenied();
      return;
    }

    if (
      cameraPermission === 'granted' &&
      cameraRef.current &&
      loaded &&
      activeDevice
    ) {
      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      // Reset seconds
      secondsRef.current = 10;
      setSecondsRemaining(10);

      // Reset states
      setHeadDistance(null);
      setTooNear(false);
      setTooFar(false);
      setIsPerfectDistance(false);
      setFaceCount(0);

      intervalRef.current = setInterval(async () => {
        // Run capture
        const response = await capturePhoto();

        // Decrease timer
        secondsRef.current -= 1;
        setSecondsRemaining(secondsRef.current);
        console.log(`⏱️ Time remaining: ${secondsRef.current}s`);

        // Stop condition: success or timeout
        const timeout = secondsRef.current <= 0;
        const success = response;

        if (success || timeout) {
          // Add a small delay to ensure the last result is shown
          setTimeout(() => {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            setIsMeasuring(false);

            if (timeout && !success) {
              console.log('⛔ Timeout reached, stopping capture');

              Alert.alert(
                'Timeout',
                'Measurement session expired. Please try again.',
                [
                  {
                    text: 'Cancel',
                    onPress: () => navigation.goBack(),
                    style: 'destructive',
                  },
                  {
                    text: 'Continue',
                    onPress: () => {
                      console.log('Restarting measurement...');
                      setIsMeasuring(true);
                      startCapture();
                    },
                  },
                ],
              );
            }
          }, 500); // 500ms delay to ensure last result is shown
        }
      }, 1000);
    }
  };

  useEffect(() => {
    setIsMeasuring(true);
    startCapture();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [cameraPermission, loaded, activeDevice]);

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
    let color = Colors.black;

    if (isTooNear) {
      color = Colors.red;
    } else if (isTooFar) {
      color = Colors.orange;
    } else if (isPerfectDistance) {
      color = Colors.green;
    }

    return (
      <View style={styles.distanceMessageContainer}>
        <Text style={[styles.distanceText, {color}]}>{distanceText}</Text>

        {faceCount > 0 && (
          <Text style={styles.faceCountText}>Faces detected: {faceCount}</Text>
        )}
      </View>
    );
  };

  useEffect(() => {
    if (isTooNear) {
      setDistanceText('Too close! Please move back.');
    } else if (isTooFar) {
      setDistanceText('Too far! Please move closer.');
    } else if (isPerfectDistance) {
      setDistanceText('Perfect distance!');
    }
  }, [isTooNear, isTooFar, isPerfectDistance]);

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

  //TODO : error on the head distance
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
          ref={cameraRef}
          style={styles.camera}
          device={activeDevice}
          isActive={isActiveRef.current}
          photo={true}
          onError={error => {
            console.log('Camera initialization error', error);
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
      {!isMeasuring && (
        <BottomButton
          title="Continue"
          onPress={() => navigation.navigate('LandoltCTest')}
        />
      )}
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
    flex: 2, // Ensures the camera takes available space
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  camera: {
    width: '100%',
    height: '100%',
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
    width: 200, // Width of the circle
    height: 250, // Height of the circle (same as width to make it circular)
    borderRadius: 125, // Half of width/height to make it circular
    borderColor: 'white',
    borderWidth: 2,
    borderStyle: 'dashed', // Dotted border
    justifyContent: 'center',
    alignItems: 'center',
  },
});
