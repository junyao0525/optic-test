import React, {useEffect} from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Camera} from 'react-native-vision-camera';
import {useCameraContext} from '../../hocs/CameraProvider';

import {useDistanceMeasure} from '../../hocs/DistanceProvider';
import {Colors, TextStyle} from '../themes';
import BottomButton from './BottomButton';

type Props = {
  handleButtonPress: () => void;
};

const DistanceMeasureView = ({handleButtonPress}: Props) => {
  const {
    cameraRef,
    headDistance,
    isMeasuring,
    distanceText,
    faceCount,
    secondsRemaining,
    color,
    startCapture,
  } = useDistanceMeasure();
  const {cameraPermission, activeDevice, loaded} = useCameraContext();

  useEffect(() => {
    if (cameraPermission === 'granted' && loaded && activeDevice) {
      startCapture();
    }
  }, [cameraPermission, loaded, activeDevice]);

  if (!activeDevice || cameraPermission !== 'granted') {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>
          Camera not ready or permission denied
        </Text>
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
          ref={cameraRef}
          style={styles.camera}
          device={activeDevice}
          isActive
          photo
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
            <Text style={styles.measuringText}>
              Measuring... {secondsRemaining}s
            </Text>
          </View>
        )}
        <Text style={[styles.distanceText, {color}]}>{distanceText}</Text>

        {faceCount > 0 && (
          <Text style={styles.faceCountText}>Faces detected: {faceCount}</Text>
        )}
      </View>

      {distanceText === 'Perfect distance!' && (
        <BottomButton title="Continue" onPress={handleButtonPress} />
      )}
    </View>
  );
};

export default DistanceMeasureView;

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
