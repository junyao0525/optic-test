import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Camera} from 'react-native-vision-camera';
import CameraProvider, {useCameraContext} from '../../../hocs/CameraProvider';
import {useDetectFaceAPI} from '../../api/python';
import {Colors, TextStyle} from '../../themes';

const DistanceMeasure = () => {
  const camera = useRef<Camera>(null);
  const {loaded, cameraPermission, activeDevice} = useCameraContext();
  const isActiveRef = useRef(true);
  const capturingRef = useRef(false); // Added missing ref
  const [headDistance, setHeadDistance] = useState<
    'tooClose' | 'perfect' | 'tooFar' | null
  >(null);
  const navigation = useNavigation();
  const {mutateAsync} = useDetectFaceAPI();

  useEffect(() => {
    if (cameraPermission === 'granted') {
      isActiveRef.current = true;
    } else if (cameraPermission === 'denied') {
      Alert.alert(
        'Permission Denied',
        'Camera access is denied. Please enable it in settings.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => {
              navigation.goBack();
            },
          },
          {
            text: 'Open Settings',
            onPress: () => Linking.openSettings(),
          },
        ],
      );
    }
  }, [cameraPermission, navigation]);

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
      {/* Text Section */}
      <View style={styles.textContainer}>
        {headDistance === null ? (
          <Text style={[TextStyle.H3, styles.text]}>
            Hold your device and match your face within the circle and sit in a
            well-lit room.
          </Text>
        ) : (
          <Text style={[TextStyle.H3, styles.text]}>All done</Text>
        )}
      </View>

      {/* Camera Section */}
      <View style={styles.cameraContainer}>
        <Camera
          ref={camera}
          style={StyleSheet.absoluteFill}
          device={activeDevice}
          isActive={isActiveRef.current}
          photo={true}
        />
      </View>

      {/* Status Section */}
      <View style={styles.statusContainer}>
        <View style={styles.measureTextContainer}>
          <ActivityIndicator color={Colors.primary} />
          <Text style={styles.measuringText}>Measuring...</Text>
        </View>

        {/* Conditional Distance Message */}
        {headDistance === 'tooClose' ? (
          <Text style={[styles.distanceText, {color: Colors.red}]}>
            Please move your head further (40-70cm recommended)
          </Text>
        ) : headDistance === 'perfect' ? (
          <Text style={[styles.distanceText, {color: Colors.green}]}>
            Perfect Distance (40-70cm)
          </Text>
        ) : headDistance === 'tooFar' ? (
          <Text style={[styles.distanceText, {color: Colors.orange}]}>
            Please move your head closer (40-70cm recommended)
          </Text>
        ) : (
          <Text style={styles.distanceText}>Adjust your head position</Text>
        )}
      </View>
    </View>
  );
};

export default function DistanceMeasureWithProvider() {
  return (
    <CameraProvider>
      <DistanceMeasure />
    </CameraProvider>
  );
}

const styles = StyleSheet.create({
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
  distanceText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  errorText: {
    fontSize: 18,
    color: Colors.black,
    textAlign: 'center',
    padding: 20,
  },
});
