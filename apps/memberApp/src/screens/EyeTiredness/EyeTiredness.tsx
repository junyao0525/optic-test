import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  Camera,
  useCameraDevice
} from 'react-native-vision-camera';
import { Colors, TextStyle } from '../../themes';

export default function EyeTiredness() {
  const cameraRef = useRef(null);
  const [permission, setPermission] = useState('');
  const device = useCameraDevice('front');
  const { t } = useTranslation();

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setPermission(status);
      console.log('Camera permission status:', status);
      if (status !== 'granted') {
        Alert.alert(
          t('eye_tiredness.camera_permission_alert.title'),
          t('eye_tiredness.camera_permission_alert.message'),
        );
      }
    })();
  }, [t]);

  const capturePhoto = async () => {
    if (cameraRef.current) {
      console.log('Camera is ready for capturing photos.');
    }
  };

  if (!device) return <Text>{t('eye_tiredness.loading_camera')}</Text>;

  return permission === 'granted' ? (
    <View style={styles.container}>
      {/* Text Section */}
      <View style={styles.textContainer}>
        <Text style={[TextStyle.H3, styles.text]}>
          {t('eye_tiredness.instructions')}
        </Text>
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
        <View style={styles.faceFrame} />
      </View>

      {/* Button Section */}
      <View style={{flex: 1}}>
        <TouchableOpacity style={styles.captureButton} onPress={capturePhoto}>
          <View style={styles.captureButtonInner} />
        </TouchableOpacity>
      </View>
    </View>
  ) : (
    <Text>{t('eye_tiredness.camera_permission_required')}</Text>
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
  captureButton: {
    backgroundColor: 'gray',
    borderRadius: 50,
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center', // Center the button horizontally
    marginVertical: 20,
  },
  captureButtonInner: {
    backgroundColor: 'white',
    borderRadius: 50,
    height: 40,
    width: 40,
  },
  faceFrame: {
    position: 'absolute',
    width: 250, // Width of the circle
    height: 300, // Height of the circle (same as width to make it circular)
    borderRadius: 125, // Half of width/height to make it circular
    borderColor: 'white',
    borderWidth: 2,
    borderStyle: 'dashed', // Dotted border
    justifyContent: 'center',
    alignItems: 'center',
  },
});
