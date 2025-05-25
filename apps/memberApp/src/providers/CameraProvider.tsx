import React, {
  createContext,
  useContext,
  useLayoutEffect,
  useState,
} from 'react';
import {
  Camera,
  CameraDevice,
  CameraPermissionStatus,
} from 'react-native-vision-camera';

// Define the shape of the context value
type CameraContextValue = {
  cameraPermission: CameraPermissionStatus | null;
  loaded: boolean;
  devices: CameraDevice[] | null;
  activeDevice: CameraDevice | null;
  setActiveDevice: (device: CameraDevice) => void;
};

// Initial state for the context
const initialState: CameraContextValue = {
  cameraPermission: null,
  loaded: false,
  devices: null,
  activeDevice: null,
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
        setActiveDevice,
      }}>
      {children}
    </cameraContext.Provider>
  );
};

export const useCameraContext = () => useContext(cameraContext);

export default CameraProvider;
