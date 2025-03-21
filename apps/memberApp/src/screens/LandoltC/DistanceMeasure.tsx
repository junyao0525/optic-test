import React, {useEffect, useRef, useState} from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import icon package
import {Camera, useCameraDevice} from 'react-native-vision-camera';
import {Colors, TextStyle} from '../../themes';

export default function DistanceMeasure() {
  const cameraRef = useRef(null);
  const [permission, setPermission] = useState('');
  const [headDistance, setHeadDistance] = useState(null); // Manage head distance
  const device = useCameraDevice('front');

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setPermission(status);
      console.log('Camera permission status:', status);
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Camera access is needed to use this feature. Please grant camera permissions in your device settings.',
        );
      }
    })();
  }, []);

  const updateHeadDistance = () => {
    // setHeadDistance(distance); // Update the head distance
  };

  if (!device) return <Text>Loading front camera...</Text>;

  return permission === 'granted' ? (
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
          ref={cameraRef}
          style={styles.camera}
          device={device}
          isActive={true}
          photo={true}
        />
      </View>

      {/* Button Section */}
      <View style={{flex: 1, alignItems: 'center'}}>
        <Text style={styles.measuringText}>
          <Icon name="loading" size={30} color={Colors.black} /> Measuring...
        </Text>

        {/* Conditional Distance Message */}
        {headDistance === 'tooClose' ? (
          <Text style={[styles.distanceText, {color: Colors.red}]}>
            Please move your head further.
          </Text>
        ) : headDistance === 'perfect' ? (
          <Text style={[styles.distanceText, {color: Colors.green}]}>
            Perfect Distance
          </Text>
        ) : (
          <Text style={styles.distanceText}>Adjust your head position</Text>
        )}
      </View>
    </View>
  ) : (
    <Text>Camera permission is required.</Text>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  measuringText: {
    marginVertical: 10,
    fontSize: 18,
    color: Colors.black,
  },
  distanceText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
