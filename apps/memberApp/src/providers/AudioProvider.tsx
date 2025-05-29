import {
  createContext,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {Platform} from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import {
  check,
  Permission,
  PERMISSIONS,
  PermissionStatus,
  request,
  RESULTS,
} from 'react-native-permissions';

export type AudioContextValue = {
  audioPermission: PermissionStatus | null;
  audioRef: React.RefObject<AudioRecorderPlayer> | null;
  isRecording: boolean;
  currentDurationSec: number;
  recordTime: string;
  audioLevels: number[];
  isProcessing: boolean;
  filePath: string;
  // Add methods for controlling audio
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  requestPermission: () => Promise<void>;
};

const initialData: Partial<AudioContextValue> = {
  audioPermission: null,
  audioRef: null,
  isRecording: false,
  currentDurationSec: 0,
  recordTime: '00:00:00',
  audioLevels: Array(20).fill(0),
  isProcessing: false,
  filePath: '',
};

// Create context with proper typing
const AudioContext = createContext<AudioContextValue>({
  ...initialData,
  startRecording: async () => {},
  stopRecording: async () => {},
  requestPermission: async () => {},
} as AudioContextValue);

const AudioProvider = ({children}: {children: React.ReactNode}) => {
  const audioRef = useRef<AudioRecorderPlayer>(new AudioRecorderPlayer());
  const [audioPermission, setAudioPermission] =
    useState<PermissionStatus | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [currentDurationSec, setCurrentDurationSec] = useState<number>(0);
  const [recordTime, setRecordTime] = useState<string>('00:00:00');
  const [audioLevels, setAudioLevels] = useState<number[]>(Array(20).fill(0));
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [filePath, setFilePath] = useState<string>('');

  const requestPermission = async () => {
    try {
      const permission: Permission =
        Platform.OS === 'android'
          ? PERMISSIONS.ANDROID.RECORD_AUDIO
          : PERMISSIONS.IOS.MICROPHONE;

      const result = await check(permission);

      if (result === RESULTS.DENIED || result === RESULTS.UNAVAILABLE) {
        const requestResult = await request(permission);
        setAudioPermission(requestResult);
      } else {
        setAudioPermission(result);
      }
    } catch (error) {
      console.error('Error requesting audio permission:', error);
    }
  };

  const startRecording = async () => {
    try {
      if (audioPermission !== RESULTS.GRANTED) {
        await requestPermission();
        return;
      }

      setIsProcessing(true);
      setIsRecording(true);

      const path = Platform.select({
        ios: 'audio.m4a',
        android: 'sdcard/audio.mp4',
      });

      const result = await audioRef.current?.startRecorder(path);
      setFilePath(result || '');

      // Set up recording progress listener
      audioRef.current?.addRecordBackListener(e => {
        setCurrentDurationSec(e.currentPosition);
        setRecordTime(
          audioRef.current?.mmssss(Math.floor(e.currentPosition)) || '00:00:00',
        );

        // Simulate audio levels (you might want to implement actual audio level detection)
        const newLevels = Array(20)
          .fill(0)
          .map(() => Math.random() * (e.currentPosition > 0 ? 1 : 0));
        setAudioLevels(newLevels);
      });

      setIsProcessing(false);
    } catch (error) {
      console.error('Error starting recording:', error);
      setIsProcessing(false);
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    try {
      setIsProcessing(true);

      const result = await audioRef.current?.stopRecorder();
      audioRef.current?.removeRecordBackListener();

      setIsRecording(false);
      setCurrentDurationSec(0);
      setRecordTime('00:00:00');
      setAudioLevels(Array(20).fill(0));
      setIsProcessing(false);

      if (result) {
        setFilePath(result);
      }
    } catch (error) {
      console.error('Error stopping recording:', error);
      setIsProcessing(false);
    }
  };

  useLayoutEffect(() => {
    console.log('AudioProvider mounted');
    requestPermission(); // Fixed: Actually call the function

    // Cleanup function
    return () => {
      if (isRecording) {
        audioRef.current?.stopRecorder();
        audioRef.current?.removeRecordBackListener();
      }
    };
  }, []);

  // Log permission changes
  useLayoutEffect(() => {
    console.log('Audio permission status:', audioPermission);
  }, [audioPermission]);

  const contextValue: AudioContextValue = {
    audioPermission,
    audioRef,
    isRecording,
    currentDurationSec,
    recordTime,
    audioLevels,
    isProcessing,
    filePath,
    startRecording,
    stopRecording,
    requestPermission,
  };

  return (
    <AudioContext.Provider value={contextValue}>
      {children}
    </AudioContext.Provider>
  );
};

// Custom hook for using the audio context
export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

export {AudioContext, AudioProvider};
