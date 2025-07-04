import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {Camera} from 'react-native-vision-camera';
import {useFatigueDetectionAPI} from '../../api/python';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Colors} from '../../themes';
import SuccessPage from '../../components/SuccessScreen';
import {useCameraContext} from '../../providers/CameraProvider';
import Video, {VideoRef} from 'react-native-video';
import {
  FatigueController,
  FatigueResult,
} from '../../api/EyeFatigue/controller';
import {useUserId} from '../../utils/userUtils';
import {FatigueDetectionApi} from '@vt/core/apis/app/python';
import {useTranslation} from 'react-i18next';
const DURATION_SECONDS = 30;
const FPS = 60;

const DotTracking = () => {
  const videoRef = useRef<VideoRef>(null);
  const cameraRef = useRef<Camera>(null);
  const isActiveRef = useRef<boolean>(true);
  const [frame, setFrame] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [showRedDot, setShowRedDot] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isUploadSuccess, setIsUploadSuccess] = useState(false);
  const {loaded, cameraPermission, activeDevice} = useCameraContext();
  const fatigueUpload = useFatigueDetectionAPI();
  const [isProcessing, setIsProcessing] = useState(false);
  const [fatigueMessage, setFatigueMessage] =
    useState<FatigueDetectionApi['Response']>();
  const userId = useUserId();
  const {t} = useTranslation();
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && isCameraReady) {
      setShowRedDot(true);
      startRecording();
    }
  }, [countdown, isCameraReady]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRecording && activeDevice && loaded && cameraRef.current) {
      interval = setInterval(() => {
        setFrame(prev => {
          const next = prev + 1;
          if (next >= FPS * DURATION_SECONDS) stopRecording();
          return next;
        });
      }, 1000 / FPS);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording, loaded, activeDevice]);

  const startRecording = async () => {
    if (isRecording || !cameraRef.current) return;
    setIsRecording(true);
    setFrame(0);

    try {
      await cameraRef.current.startRecording({
        onRecordingFinished: async video => {
          console.log('Video recorded:', video.path);
          uploadVideo(video.path);
        },
        onRecordingError: error => {
          console.error('Recording error:', error);
          Alert.alert('Error', error.message || 'Recording failed.');
        },
        fileType: Platform.OS === 'ios' ? 'mov' : 'mp4',
      });

      setTimeout(() => stopRecording(), DURATION_SECONDS * 1000);
    } catch (err) {
      console.error('Recording start error:', err);
    }
  };

  const stopRecording = () => {
    if (!cameraRef.current || !isRecording) return; // Check if camera is available and recording is in progress

    try {
      cameraRef.current.stopRecording();
      setIsRecording(false);
    } catch (err) {
      console.warn('Error stopping recording:', err);
    }
  };

  const uploadVideo = async (videoPath: string) => {
    setIsProcessing(true); // Show loading

    const formData = new FormData();
    formData.append('file', {
      uri: Platform.OS === 'android' ? 'file://' + videoPath : videoPath,
      name: 'video.mp4',
      type: Platform.OS === 'ios' ? 'video/quicktime' : 'video/mp4',
    });

    const response = await fatigueUpload.mutateAsync(formData, {
      onSuccess: async data => {
        const payload: FatigueResult = {
          user_id: userId ? userId : 0,
          perclos: data['PERCLOS'],
          avg_blink: data['Avg Blink Duration'],
          ear_mean: data['EAR Mean'],
          ear_std: data['EAR Std'],
          blink_rate: data['Blink Rate'],
          class: data['Predicted Fatigue Class'],
        };
        const result = await FatigueController.insertTestResult(payload);
        setFatigueMessage(data);
        setIsUploadSuccess(true);
        setIsProcessing(false);
      },
      onError: error => {
        setIsUploadSuccess(false);
        setIsProcessing(false);
        Alert.alert('Error', error.message || 'Upload failed.');
      },
    });

    console.log(response);
  };

  const handleCameraInitialized = () => {
    setIsCameraReady(true);
  };

  if (!activeDevice || cameraPermission !== 'granted') {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>
          {cameraPermission !== 'granted'
            ? t('eye_tiredness.camera_permission_required')
            : t('eye_tiredness.front_camera_unavailable')}
        </Text>
      </SafeAreaView>
    );
  }
  if (isProcessing) {
    return (
      <View style={[styles.container, styles.processingContainer]}>
        <View style={styles.processingContent}>
          <ActivityIndicator
            size="large"
            color={Colors.primary || Colors.blue}
            style={styles.spinner}
          />
          <Text style={styles.processingTitle}>
            {t('eye_tiredness.analyzing_fatigue')}
          </Text>
          <Text style={styles.processingSubtitle}>
            {t('eye_tiredness.analyzing_subtitle')}
          </Text>
        </View>
      </View>
    );
  }

  if (isUploadSuccess) {
    return (
      <SuccessPage
        successMessage={t('eye_tiredness.video_upload_success')}
        targetScreen="Home"
        extraData={fatigueMessage}
      />
    );
  }

  return (
    <View style={styles.container}>
      {countdown > 0 ? (
        <View
          style={[
            styles.countdownContainer,
            {backgroundColor: Colors.backgroundColor},
          ]}>
          <Text style={styles.countdownText}>{countdown}</Text>
        </View>
      ) : (
        <>
          <Camera
            ref={cameraRef}
            style={styles.camera}
            device={activeDevice}
            isActive={isActiveRef.current}
            video={true}
            audio={false}
            onInitialized={handleCameraInitialized}
          />
          {showRedDot && (
            <View style={styles.redDotContainer}>
              <Text style={styles.hintText}>
                {t('eye_tiredness.relax_watch_video')}
              </Text>
              <Video
                ref={videoRef}
                source={require('../../../assets/nature_ocean_30s.mp4')}
                style={styles.video}
                resizeMode="cover"
                repeat={true}
              />
              <Video />
            </View>
          )}
          <Text style={styles.timerText}>
            {Math.min(parseFloat((frame / FPS).toFixed(1)), DURATION_SECONDS)}s
            / {DURATION_SECONDS}s
          </Text>
        </>
      )}
    </View>
  );
};

export default DotTracking;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.backgroundColor,
  },
  camera: {width: '100%', height: '100%', position: 'absolute', opacity: 0},
  timerText: {
    position: 'absolute',
    bottom: 50,
    fontSize: 20,
    color: Colors.white,
  },
  video: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  errorText: {
    fontSize: 18,
    color: Colors.black,
    textAlign: 'center',
    padding: 20,
  },
  countdownContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownText: {
    fontSize: 80,
    fontWeight: 'bold',
    color: Colors.black,
    position: 'absolute',
    top: '40%',
  },
  redDotContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  hintText: {
    fontSize: 16,
    textAlign: 'center',
    color: Colors.black,
    position: 'absolute',
    top: 100,
    width: '100%',
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingVertical: 10,
  },
  dotContainer: {
    flex: 1,
  },
  gif: {
    width: '100%',
    aspectRatio: 1,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  processingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.backgroundColor || '#f8f9fa',
    padding: 32,
  },
  processingContent: {
    alignItems: 'center',
    backgroundColor: Colors.white || '#ffffff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    minWidth: 280,
  },
  spinner: {
    marginBottom: 16,
  },
  processingTitle: {
    color: Colors.black || '#1a1a1a',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  processingSubtitle: {
    color: Colors.secondary || '#666666',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
});
