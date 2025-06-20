import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  ActivityIndicator,
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
import {useDetectAudioAPI} from '../api/python';
import {useLanguage} from '../hooks/useLanguage';
import {useWindowDimension} from '../hooks/useWindowDimension';
import {Colors} from '../themes';
import {Direction} from '../utils/logMar';
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
  onAudioProcessed?: (direction: Direction) => void;
  isProcessing?: boolean;
  testInfo?: {
    currentLevel: number;
    totalLevels: number;
    currentSnellen: string;
    remainingAttempts: number;
    isPreviousLevel: boolean;
  };
  feedback?: {
    show: boolean;
    isCorrect: boolean;
    expectedDirection: Direction | null;
  };
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
  onAudioProcessed,
  testInfo,
  feedback,
  isProcessing,
}) => {
  // State
  const [recordingState, setRecordingState] = useState<RecordingState>({
    isRecording: false,
    currentDurationSec: 0,
    recordTime: '00:00:00',
  });
  const [filePath, setFilePath] = useState<string>('');
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);
  const [showLimitMessage, setShowLimitMessage] = useState(false);
  const [canRetry, setCanRetry] = useState(false);
  const processingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Refs
  const audioRecorderPlayer = useRef(new AudioRecorderPlayer());
  const levelUpdateInterval = useRef<NodeJS.Timeout | null>(null);
  const maxDurationTimeout = useRef<NodeJS.Timeout | null>(null);

  const {mutateAsync: detectAudioMutateAsync} = useDetectAudioAPI();

  const {t} = useTranslation();

  const currentLanguage = useLanguage();
  const {height} = useWindowDimension();

  // Add function to process transcription
  const processTranscription = (transcription: string): Direction | null => {
    const text = transcription.toLowerCase().trim();

    switch (true) {
      case text.includes('up'):
        return 'up';
      case text.includes('right'):
        return 'right';
      case text.includes('down'):
        return 'down';
      case text.includes('left'):
        return 'left';
      default:
        return null;
    }
  };

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

  const deleteAudioFile = async (filePath: string) => {
    try {
      const exists = await RNFetchBlob.fs.exists(filePath);
      if (exists) {
        await RNFetchBlob.fs.unlink(filePath);
        console.log('Audio file deleted successfully:', filePath);
      }
    } catch (error) {
      console.error('Error deleting audio file:', error);
    }
  };

  const startRecording = async () => {
    try {
      setIsProcessingAudio(false);
      setShowLimitMessage(false);
      setCanRetry(false);
      const path = getAudioFilePath();
      setFilePath(path);

      const result = await audioRecorderPlayer.current.startRecorder(path, {
        AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
        AudioSourceAndroid: AudioSourceAndroidType.MIC,
        OutputFormatAndroid: OutputFormatAndroidType.MPEG_4,
      });

      console.log('Recording started:', result);

      // Clear any existing timeout
      if (maxDurationTimeout.current) {
        clearTimeout(maxDurationTimeout.current);
      }

      // Set maximum recording duration
      maxDurationTimeout.current = setTimeout(() => {
        console.log('Max duration reached, stopping recording');
        handleMaxDurationReached();
      }, maxDuration * 1000);

      audioRecorderPlayer.current.addRecordBackListener(e => {
        const currentPosition = e.currentPosition / 1000;
        setRecordingState({
          isRecording: true,
          currentDurationSec: currentPosition,
          recordTime: audioRecorderPlayer.current.mmssss(
            Math.floor(e.currentPosition),
          ),
        });

        if (currentPosition >= maxDuration) {
          console.log('Duration limit reached in listener');
          handleMaxDurationReached();
        }
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      onRecordingError?.(
        error instanceof Error ? error : new Error('Unknown recording error'),
      );
    }
  };

  const stopRecording = async () => {
    try {
      if (levelUpdateInterval.current) {
        clearInterval(levelUpdateInterval.current);
        levelUpdateInterval.current = null;
      }

      if (maxDurationTimeout.current) {
        clearTimeout(maxDurationTimeout.current);
        maxDurationTimeout.current = null;
      }

      const result = await audioRecorderPlayer.current.stopRecorder();
      audioRecorderPlayer.current.removeRecordBackListener();

      setRecordingState({
        ...recordingState,
        isRecording: false,
      });

      // Only process the recording if it wasn't stopped due to max duration
      if (!canRetry) {
        // Check if file exists
        const fileExists = await RNFetchBlob.fs.exists(filePath);
        if (!fileExists) {
          throw new Error('Recording file not found');
        }

        const fileName = filePath.split('/').pop() || 'recording.m4a';
        const fileUri = Platform.OS === 'ios' ? filePath : `file://${filePath}`;

        // Set processing state
        setIsProcessingAudio(true);

        try {
          // Process the recording
          const formData = new FormData();
          formData.append('file', {
            uri: fileUri,
            type: 'audio/mpeg',
            name: fileName,
          } as Partial<AudioFile>);
          formData.append(
            'language',
            currentLanguage.currentLanguage.toLowerCase(),
          );

          const response = await detectAudioMutateAsync(formData);
          console.log('Audio detection response:', response);

          const fileStat = await RNFetchBlob.fs.stat(filePath);
          if (fileStat.size === 0) {
            throw new Error('Recording file is empty');
          }

          // Process the transcription and determine direction
          const detectedDirection = processTranscription(
            response.transcription,
          );
          if (detectedDirection) {
            onAudioProcessed?.(detectedDirection);
          } else {
            onRecordingError?.(
              new Error('Could not determine direction from audio'),
            );
          }

          // Call completion callback
          onRecordingComplete?.({
            uri: fileUri,
            name: fileName,
            type: 'audio/mpeg',
            size: fileStat.size,
          });

          // Delete the audio file after successful processing
          await deleteAudioFile(filePath);

          // Add delay before allowing next recording and reset timer
          processingTimeoutRef.current = setTimeout(() => {
            setIsProcessingAudio(false);
            // Reset recording state
            setRecordingState({
              isRecording: false,
              currentDurationSec: 0,
              recordTime: '00:00:00',
            });
          }, 1000);
        } catch (apiError) {
          console.error('API error:', apiError);
          onRecordingError?.(new Error('Failed to process audio file'));
          // Delete the audio file on error
          await deleteAudioFile(filePath);
          setIsProcessingAudio(false);
          // Reset recording state on error
          setRecordingState({
            isRecording: false,
            currentDurationSec: 0,
            recordTime: '00:00:00',
          });
        }
      } else {
        // If canRetry is true, delete the audio file
        await deleteAudioFile(filePath);
      }
    } catch (error) {
      console.error('Error stopping recording:', error);
      onRecordingError?.(
        error instanceof Error ? error : new Error('Error stopping recording'),
      );
      // Delete the audio file on error
      await deleteAudioFile(filePath);
      setIsProcessingAudio(false);
      // Reset recording state on error
      setRecordingState({
        isRecording: false,
        currentDurationSec: 0,
        recordTime: '00:00:00',
      });
    }
  };

  const handleMaxDurationReached = async () => {
    console.log('Handling max duration reached');
    if (recordingState.isRecording) {
      try {
        // Clear the timeout
        if (maxDurationTimeout.current) {
          clearTimeout(maxDurationTimeout.current);
          maxDurationTimeout.current = null;
        }

        // Stop the recorder
        await audioRecorderPlayer.current.stopRecorder();
        audioRecorderPlayer.current.removeRecordBackListener();

        setShowLimitMessage(true);
        setCanRetry(true);

        // Delete the audio file
        await deleteAudioFile(filePath);

        // Reset recording state
        setRecordingState({
          isRecording: false,
          currentDurationSec: 0,
          recordTime: '00:00:00',
        });

        // Hide message after 3 seconds
        setTimeout(() => {
          setShowLimitMessage(false);
        }, 3000);
      } catch (error) {
        console.error('Error in handleMaxDurationReached:', error);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (maxDurationTimeout.current) {
        clearTimeout(maxDurationTimeout.current);
      }
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
      }
    };
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const getDirectionEmoji = (direction: Direction) => {
    switch (direction) {
      case 'up':
        return '⬆️';
      case 'right':
        return '➡️';
      case 'down':
        return '⬇️';
      case 'left':
        return '⬅️';
      default:
        return '';
    }
  };

  return (
    <>
      <Header backHomeButton title={t('landolt.header')} />
      <View style={styles.container}>
        {/* <Text style={styles.title}>{title}</Text> */}
        {subTitle && <Text style={styles.title}>{subTitle}</Text>}

        <View style={styles.testInfo}>
          <Text style={styles.eyeIndicator}>
            {t('landolt.testing_eye', {
              eye:
                eye === 'LEFT' ? t('landolt.left_eye') : t('landolt.right_eye'),
              cover_instruction:
                eye === 'LEFT'
                  ? t('landolt.cover_right_eye')
                  : t('landolt.cover_left_eye'),
            })}
          </Text>

          {testInfo && (
            <View
              style={{
                width: '100%',
                height: height * 0.16,
                backgroundColor: '#fff',
                borderRadius: 10,
                elevation: 5,
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.2,
                shadowRadius: 4,
              }}>
              <Text style={styles.levelText}>
                {t('landolt.level')} {testInfo?.currentLevel}/
                {testInfo?.totalLevels}
              </Text>
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      width: `${
                        (testInfo?.currentLevel / testInfo?.totalLevels) * 100
                      }%`,
                    },
                  ]}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingHorizontal: 20,
                  paddingTop: 10,
                }}>
                <View>
                  <Text style={styles.snellenText}>{t('landolt.snellen')}</Text>
                  <Text style={styles.attemptsText}>
                    {testInfo.currentSnellen}
                  </Text>
                </View>
                <View>
                  <Text style={styles.snellenText}>
                    {t('landolt.remaining_attempts')}
                  </Text>
                  <Text style={styles.attemptsText}>
                    {testInfo.remainingAttempts}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>

        <View style={styles.instructionContainer}>
          <Text style={styles.instruction}>{instruction}</Text>
        </View>

        <Animated.View
          style={[styles.testArea, isProcessing && styles.testAreaProcessing]}>
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
                ? styles.recordingButton
                : isProcessingAudio
                ? styles.processingButton
                : styles.startButton,
            ]}
            onPressIn={startRecording}
            onPressOut={stopRecording}
            disabled={isProcessingAudio}>
            {isProcessingAudio ? (
              <ActivityIndicator color="#FFF" size="small" />
            ) : recordingState.isRecording ? (
              <View style={styles.recordingIcon} />
            ) : (
              <View style={styles.startIcon} />
            )}
          </TouchableOpacity>
        </View>

        {showLimitMessage && (
          <View style={styles.limitMessageContainer}>
            <Text style={styles.limitMessageText}>
              {t('landolt.max_recording_time.message')}
            </Text>
            <Text style={styles.retryMessageText}>
              {t('landolt.retry_recording')}
            </Text>
          </View>
        )}

        {feedback?.show && (
          <View
            style={[
              styles.feedbackContainer,
              {
                backgroundColor: feedback.isCorrect
                  ? Colors.darkGreen
                  : '#e74c3c',
              },
            ]}>
            <Text style={styles.feedbackText}>
              {feedback.isCorrect ? '✅ ' : '❌ '}
              {feedback.isCorrect
                ? t('landolt.correct_answer')
                : t('landolt.incorrect_answer')}
            </Text>
            {!feedback.isCorrect && feedback.expectedDirection && (
              <Text style={styles.expectedDirection}>
                {t('landolt.expected_direction')}:{' '}
                {getDirectionEmoji(feedback.expectedDirection)}
              </Text>
            )}
          </View>
        )}
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
    width: 72,
    height: 72,
    borderRadius: 36,
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
  recordingButton: {
    backgroundColor: '#e74c3c',
    transform: [{scale: 1.1}],
  },
  processingButton: {
    backgroundColor: '#95a5a6',
  },
  startIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFF',
  },
  recordingIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#FFF',
    borderRadius: 2,
  },
  statusText: {
    marginTop: 16,
    fontSize: 14,
    color: '#888',
  },
  levelInfo: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  levelText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.darkGreen,
    textAlign: 'center',
    marginBottom: 5,
    paddingTop: 10,
  },
  snellenText: {
    fontSize: 16,
    color: Colors.black,
    textAlign: 'center',
    marginBottom: 5,
  },
  attemptsText: {
    fontSize: 16,
    color: Colors.black,
    textAlign: 'center',
    marginBottom: 5,
  },
  previousLevelText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  testAreaProcessing: {
    opacity: 0.7,
    backgroundColor: '#f0f0f0',
  },
  feedbackContainer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  feedbackText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 5,
  },
  expectedDirection: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  progressBarContainer: {
    width: '90%',
    height: 10,
    backgroundColor: '#E3F2FD',
    borderRadius: 5,
    marginHorizontal: '5%',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#2196F3',
    borderRadius: 5,
  },
  limitMessageContainer: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  limitMessageText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 5,
  },
  retryMessageText: {
    color: '#FFF',
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

// Export with AudioProvider HOC to handle permissions
export default LandoltAudioCard;
