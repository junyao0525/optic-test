// components/LoadingOverlay.tsx
import React from 'react';
import {ActivityIndicator, StyleSheet, View, Modal} from 'react-native';
import {Colors} from '../themes';

type LoadingOverlayProps = {
  visible: boolean;
};

const LoadingOverlay = ({visible}: LoadingOverlayProps) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={() => {}}>
      <View style={styles.overlay}>
        <ActivityIndicator size="large" color={Colors.white} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // semi-transparent black backdrop
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingOverlay;
