import React, { createContext, useContext, useEffect, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';

interface StoragePermissionContextType {
  hasStoragePermission: boolean;
  requestStoragePermission: () => Promise<boolean>;
}

const StoragePermissionContext = createContext<StoragePermissionContextType>({
  hasStoragePermission: false,
  requestStoragePermission: async () => false,
});

export const useStoragePermission = () => useContext(StoragePermissionContext);

export const StoragePermissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasStoragePermission, setHasStoragePermission] = useState(false);

  const checkPermission = async () => {
    if (Platform.OS !== 'android') {
      setHasStoragePermission(true);
      return true;
    }

    try {
      if (Platform.Version >= 33) {
        // Android 13 and above
        const result = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        );
        setHasStoragePermission(result);
        return result;
      } else if (Platform.Version >= 29) {
        // Android 10-12
        const result = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        );
        setHasStoragePermission(result);
        return result;
      } else {
        // Android 9 and below
        const readResult = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        );
        const writeResult = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        );
        const result = readResult && writeResult;
        setHasStoragePermission(result);
        return result;
      }
    } catch (err) {
      console.error('Error checking storage permission:', err);
      setHasStoragePermission(false);
      return false;
    }
  };

  const requestStoragePermission = async () => {
    if (Platform.OS !== 'android') {
      setHasStoragePermission(true);
      return true;
    }

    try {
      // First check if we already have permission
      const hasPermission = await checkPermission();
      if (hasPermission) {
        return true;
      }

      if (Platform.Version >= 33) {
        // Android 13 and above
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          {
            title: 'Storage Permission',
            message: 'App needs access to your storage to upload images.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        const hasPermission = granted === PermissionsAndroid.RESULTS.GRANTED;
        setHasStoragePermission(hasPermission);
        return hasPermission;
      } else if (Platform.Version >= 29) {
        // Android 10-12
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'App needs access to your storage to upload images.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        const hasPermission = granted === PermissionsAndroid.RESULTS.GRANTED;
        setHasStoragePermission(hasPermission);
        return hasPermission;
      } else {
        // Android 9 and below
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ]);

        const hasPermission = 
          granted[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED &&
          granted[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED;

        setHasStoragePermission(hasPermission);
        return hasPermission;
      }
    } catch (err) {
      console.error('Error requesting storage permission:', err);
      setHasStoragePermission(false);
      return false;
    }
  };

  // Check permission status when the provider mounts
  useEffect(() => {
    checkPermission();
  }, []);

  return (
    <StoragePermissionContext.Provider
      value={{
        hasStoragePermission,
        requestStoragePermission,
      }}>
      {children}
    </StoragePermissionContext.Provider>
  );
}; 