import React, {useEffect, useState} from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  check,
  openSettings,
  Permission,
  request,
  RESULTS,
} from 'react-native-permissions';

interface WithPermissionsProps {
  onPermissionDenied?: () => void;
  onPermissionBlocked?: () => void;
  customPermissionDeniedView?: React.ReactNode;
  customPermissionBlockedView?: React.ReactNode;
}

export const AudioProvider = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  requiredPermissions: Permission[],
) => {
  return (props: P & WithPermissionsProps) => {
    const {
      onPermissionDenied,
      onPermissionBlocked,
      customPermissionDeniedView,
      customPermissionBlockedView,
      ...restProps
    } = props;

    const [permissionStatus, setPermissionStatus] = useState<
      'checking' | 'granted' | 'denied' | 'blocked'
    >('checking');

    useEffect(() => {
      checkPermissions();
    }, []);

    const checkPermissions = async () => {
      try {
        setPermissionStatus('checking');

        // Check all required permissions
        for (const permission of requiredPermissions) {
          const result = await check(permission);

          switch (result) {
            case RESULTS.GRANTED:
              // Continue to next permission
              break;
            case RESULTS.DENIED:
              // Request the permission
              const requestResult = await request(permission);
              if (requestResult !== RESULTS.GRANTED) {
                setPermissionStatus('denied');
                onPermissionDenied?.();
                return;
              }
              break;
            case RESULTS.BLOCKED:
            case RESULTS.UNAVAILABLE:
            case RESULTS.LIMITED:
              setPermissionStatus('blocked');
              onPermissionBlocked?.();
              return;
          }
        }

        // If we've gotten here, all permissions are granted
        setPermissionStatus('granted');
      } catch (error) {
        console.error('Error checking permissions:', error);
        setPermissionStatus('blocked');
        onPermissionBlocked?.();
      }
    };

    const openAppSettings = () => {
      openSettings().catch(() => {
        Alert.alert(
          'Unable to open settings',
          'Please open your device settings and grant the required permissions manually.',
        );
      });
    };

    if (permissionStatus === 'checking') {
      return (
        <View style={styles.container}>
          <Text style={styles.text}>Checking permissions...</Text>
        </View>
      );
    }

    if (permissionStatus === 'denied') {
      if (customPermissionDeniedView) {
        return <>{customPermissionDeniedView}</>;
      }

      return (
        <View style={styles.container}>
          <Text style={styles.text}>
            We need microphone access to record audio.
          </Text>
          <TouchableOpacity style={styles.button} onPress={checkPermissions}>
            <Text style={styles.buttonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (permissionStatus === 'blocked') {
      if (customPermissionBlockedView) {
        return <>{customPermissionBlockedView}</>;
      }

      return (
        <View style={styles.container}>
          <Text style={styles.text}>
            Microphone access is blocked. Please enable it in your device
            settings.
          </Text>
          <TouchableOpacity style={styles.button} onPress={openAppSettings}>
            <Text style={styles.buttonText}>Open Settings</Text>
          </TouchableOpacity>
        </View>
      );
    }

    // All permissions granted, render the wrapped component
    return <WrappedComponent {...(restProps as P)} />;
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4285F4',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
