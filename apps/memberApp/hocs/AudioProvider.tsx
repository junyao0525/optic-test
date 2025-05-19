import React, {
  createContext,
  useContext,
  useLayoutEffect,
  useState,
} from 'react';
import {Alert, Platform} from 'react-native';
import {
  PERMISSIONS,
  PermissionStatus,
  request,
  RESULTS,
} from 'react-native-permissions';

type AudioContextType = {
  audioPermission: PermissionStatus | null;
  loaded: boolean;
};

const initialState: AudioContextType = {
  audioPermission: null,
  loaded: false,
};

const AudioContext = createContext<AudioContextType>({...initialState});

export const useAudioContext = (): AudioContextType => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

const AudioProvider = ({children}: {children: React.ReactNode}) => {
  const [audioPermission, setAudioPermission] =
    useState<PermissionStatus | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Use useEffect to handle initialization
  useLayoutEffect(() => {
    const checkPermission = async (): Promise<void> => {
      if (Platform.OS === 'android') {
        try {
          const grantResult = await request(PERMISSIONS.ANDROID.RECORD_AUDIO);
          console.log('Permission result:', grantResult);
          setAudioPermission(grantResult);

          if (grantResult === RESULTS.GRANTED) {
            console.log('grantResult', grantResult);
            setLoaded(true);
          } else {
            console.log('grantResult', grantResult);
            setLoaded(false);
            Alert.alert(
              'Permission Denied',
              'Audio recording permission is required to use this feature.',
            );
          }
        } catch (err) {
          console.error('Permission request error:', err);
          setLoaded(false);
        }
      } else {
        console.log(
          'Non-Android platform detected, initializing AudioRecorderPlayer...',
        );
      }
    };

    checkPermission();

    // Clean up function
    return () => {};
  }, []); // Empty dependency array means this runs once on mount

  return (
    <AudioContext.Provider
      value={{
        audioPermission,
        loaded,
      }}>
      {children}
    </AudioContext.Provider>
  );
};

export default AudioProvider;
