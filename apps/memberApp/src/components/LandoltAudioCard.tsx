import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AudioRecorderPlayer, {
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  OutputFormatAndroidType,
} from 'react-native-audio-recorder-player';
import RNFetchBlob from 'rn-fetch-blob';
import { useDetectAudioAPI } from '../api/python';
import { Colors } from '../themes';
import Header from './Header';

type LandoltCardProps = {
  step: string;
  eye: 'LEFT' | 'RIGHT';
  title: string;
  subTitle?: string;
  instruction: string;
  getLandoltCStyle: () => object;
  children?: React.ReactNode;
  onRecordingComplete?: (audioFile: AudioFile) => void;
  onRecordingError?: (error: Error) => void;
  maxDuration?: number;
  visualizerColor?: string;
};

export interface AudioFile {
  uri: string;
  name: string;
  type: string;
  size: number;
}

export interface RecordingState {
  isRecording: boolean;
  currentDurationSec: number;
  recordTime: string;
}

const LandoltAudioCard: React.FC<LandoltCardProps> = ({
  step,
  eye,
  title,
  subTitle,
  instruction,
  getLandoltCStyle,
  children,
  onRecordingComplete,
  onRecordingError,
  maxDuration = 5,
}) => {
  // State
  const [recordingState, setRecordingState] = useState<RecordingState>({
    isRecording: false,
    currentDurationSec: 0,
    recordTime: '00:00:00',
  });
  const [audioLevels, setAudioLevels] = useState<number[]>(Array(20).fill(0));
  const [isProcessing, setIsProcessing] = useState(false);
  const [filePath, setFilePath] = useState<string>('');

  // Refs
  const audioRecorderPlayer = useRef(new AudioRecorderPlayer());
  const levelUpdateInterval = useRef<NodeJS.Timeout | null>(null);
  const maxDurationTimeout = useRef<NodeJS.Timeout | null>(null);

  const {mutateAsync: detectAudioMutateAsync} = useDetectAudioAPI();

  useEffect(() => {
    // Set up audio recorder player
    audioRecorderPlayer.current.setSubscriptionDuration(0.1); // 100ms for responsive visualization

    return () => {
      // Clean up
      if (recordingState.isRecording) {
        stopRecording();
      }
      if (levelUpdateInterval.current) {
        clearInterval(levelUpdateInterval.current);
      }
      if (maxDurationTimeout.current) {
        clearTimeout(maxDurationTimeout.current);
      }
    };
  }, []);

  const getAudioFilePath = (): string => {
    const dirPath = RNFetchBlob.fs.dirs.CacheDir;
    const fileName = `recording_${Date.now()}.m4a`;
    return `${dirPath}/${fileName}`;
  };

  const startRecording = async () => {
    try {
      setIsProcessing(true);

      const path = getAudioFilePath();
      setFilePath(path);

      const result = await audioRecorderPlayer.current.startRecorder(path, {
        AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
        AudioSourceAndroid: AudioSourceAndroidType.MIC,
        OutputFormatAndroid: OutputFormatAndroidType.MPEG_4,
      });

      console.log('Recording started:', result);

      // Start visualizer simulation
      levelUpdateInterval.current = setInterval(() => {
        const newLevels = [...audioLevels];
        for (let i = 0; i < newLevels.length; i++) {
          newLevels[i] = Math.random() * 0.8 + 0.2; // Values between 0.2 and 1.0
        }
        setAudioLevels(newLevels);
      }, 100);

      // Set maximum recording duration
      maxDurationTimeout.current = setTimeout(() => {
        if (recordingState.isRecording) {
          stopRecording();
          Alert.alert(
            'Maximum recording time reached',
            'The recording has reached its maximum duration.',
          );
        }
      }, maxDuration * 1000);

      audioRecorderPlayer.current.addRecordBackListener(e => {
        setRecordingState({
          isRecording: true,
          currentDurationSec: e.currentPosition / 1000,
          recordTime: audioRecorderPlayer.current.mmssss(
            Math.floor(e.currentPosition),
          ),
        });
      });

      setIsProcessing(false);
    } catch (error) {
      setIsProcessing(false);
      console.error('Error starting recording:', error);
      onRecordingError?.(
        error instanceof Error ? error : new Error('Unknown recording error'),
      );
    }
  };

  const stopRecording = async () => {
    try {
      setIsProcessing(true);

      if (levelUpdateInterval.current) {
        clearInterval(levelUpdateInterval.current);
        levelUpdateInterval.current = null;
      }

      if (maxDurationTimeout.current) {
        clearTimeout(maxDurationTimeout.current);
        maxDurationTimeout.current = null;
      }

      // Reset audio levels
      setAudioLevels(Array(20).fill(0));

      const result = await audioRecorderPlayer.current.stopRecorder();
      audioRecorderPlayer.current.removeRecordBackListener();

      setRecordingState({
        ...recordingState,
        isRecording: false,
      });

      // Check if file exists
      const fileExists = await RNFetchBlob.fs.exists(filePath);
      if (!fileExists) {
        throw new Error('Recording file not found');
      }

      const fileName = filePath.split('/').pop() || 'recording.m4a';
      const fileUri = Platform.OS === 'ios' ? filePath : `file://${filePath}`;

      // Prepare FormData for API
      const formData = new FormData();
      formData.append('file', {
        uri: fileUri,
        type: 'audio/mpeg',
        name: fileName,
      } as Partial<AudioFile>);

      console.log('Sending m4a file to API:', fileName);

      try {
        const response = await detectAudioMutateAsync(formData);
        console.log('Audio detection response:', response);

        const fileStat = await RNFetchBlob.fs.stat(filePath);
        console.log('Recorded file size:', fileStat.size);
        if (fileStat.size === 0) {
          throw new Error('Recording file is empty');
        }

        console.log(fileStat);

        // Call completion callback
        onRecordingComplete?.({
          uri: fileUri,
          name: fileName,
          type: 'audio/mpeg',
          size: fileStat.size,
        });
      } catch (apiError) {
        console.error('API error:', apiError);
        onRecordingError?.(new Error('Failed to process audio file'));
      }

      setIsProcessing(false);
    } catch (error) {
      setIsProcessing(false);
      console.error('Error stopping recording:', error);
      onRecordingError?.(
        error instanceof Error ? error : new Error('Error stopping recording'),
      );
    }
  };

  const toggleRecording = () => {
    if (recordingState.isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };
  const {t} = useTranslation();
  
  return (
    <>
      <Header backHomeButton title={t("landolt.header")} />
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        {subTitle && <Text style={styles.title}>{subTitle}</Text>}

        <View style={styles.testInfo}>
          <Text style={styles.eyeIndicator}>
            Testing: {eye} eye (
            {eye === 'LEFT' ? 'cover right eye' : 'cover left eye'})
          </Text>
        </View>

        <View style={styles.instructionContainer}>
          <Text style={styles.instruction}>{instruction}</Text>
        </View>

        <Animated.View style={styles.testArea}>
          <View style={getLandoltCStyle()} />
          {children}
        </Animated.View>

        <Text style={styles.timeText}>
          {formatTime(recordingState.currentDurationSec)}
        </Text>

        <View style={styles.controlsContainer}>
          <TouchableOpacity
            style={[
              styles.recordButton,
              recordingState.isRecording
                ? styles.stopButton
                : styles.startButton,
            ]}
            onPress={toggleRecording}
            disabled={isProcessing}>
            {isProcessing ? (
              <ActivityIndicator color="#FFF" size="small" />
            ) : (
              <View
                style={
                  recordingState.isRecording
                    ? styles.stopIcon
                    : styles.startIcon
                }
              />
            )}
          </TouchableOpacity>
        </View>

        {/* Status text */}
        {/* <Text style={styles.statusText}>
          {isProcessing
            ? 'Processing...'
            : recordingState.isRecording
            ? 'Recording m4a'
            : 'Ready to record m4a'}
        </Text> */}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: Colors.backgroundColor,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  testInfo: {
    width: '90%',
    marginBottom: 20,
  },
  eyeIndicator: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: Colors.darkGreen,
  },
  instructionContainer: {
    marginBottom: 30,
    padding: 10,
    backgroundColor: Colors.darkGreen,
    borderRadius: 8,
    width: '90%',
  },
  instruction: {
    fontSize: 16,
    textAlign: 'center',
    color: Colors.white,
  },
  testArea: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    height: '30%',
    backgroundColor: '#fff',
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginBottom: 20,
  },
  visualizerContainer: {
    width: '100%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  timeText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  recordButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  startButton: {
    backgroundColor: '#FF4136',
  },
  stopButton: {
    backgroundColor: '#888',
  },
  startIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFF',
  },
  stopIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#FFF',
  },
  statusText: {
    marginTop: 16,
    fontSize: 14,
    color: '#888',
  },
});

// Export with AudioProvider HOC to handle permissions
export default LandoltAudioCard;
