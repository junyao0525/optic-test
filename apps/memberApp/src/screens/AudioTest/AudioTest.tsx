import Voice from '@react-native-voice/voice';
import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  NativeModules,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AudioProvider, {useAudioContext} from '../../../hocs/AudioProvider';
import Header from '../../components/Header';
import {Colors, TextStyle} from '../../themes';

const AudioTest: React.FC = () => {
  const {loaded} = useAudioContext();
  const [messages, setMessages] = useState<any>([]);
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [voiceAvailable, setVoiceAvailable] = useState<boolean | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('Initializing...');

  // Use refs to track if listeners are attached and module is initialized
  const listenersAttached = useRef(false);
  const voiceInitialized = useRef(false);
  const initAttempts = useRef(0);

  // Check if the Voice native module exists
  const checkNativeModule = () => {
    const nativeModuleExists = !!NativeModules.Voice;
    console.log('Voice native module exists:', nativeModuleExists);
    setDebugInfo(
      prev =>
        `${prev}\nNative module exists: ${nativeModuleExists ? 'YES' : 'NO'}`,
    );
    return nativeModuleExists;
  };

  // Initialize Voice module
  const initializeVoice = async () => {
    try {
      initAttempts.current += 1;
      setDebugInfo(
        prev => `${prev}\nInitialization attempt #${initAttempts.current}`,
      );

      // Check if the module exists at native level
      if (!checkNativeModule()) {
        setDebugInfo(prev => `${prev}\nNative module not found!`);
        setVoiceAvailable(false);
        return false;
      }

      // Verify Voice object exists in JS
      if (!Voice) {
        console.warn('Voice module is not defined in JS');
        setDebugInfo(prev => `${prev}\nVoice not defined in JS!`);
        setVoiceAvailable(false);
        return false;
      }

      // Check if methods exist on Voice
      const methods = Object.keys(Voice);
      setDebugInfo(prev => `${prev}\nMethods on Voice: ${methods.join(', ')}`);

      if (!methods.includes('start') || !methods.includes('stop')) {
        console.warn('Voice module missing required methods');
        setDebugInfo(prev => `${prev}\nMissing required methods!`);
        setVoiceAvailable(false);
        return false;
      }

      // Try to check if Voice is available
      if (typeof Voice.isAvailable === 'function') {
        await Voice.isAvailable();
        setDebugInfo(prev => `${prev}\nisAvailable check passed`);
      }

      voiceInitialized.current = true;
      setVoiceAvailable(true);
      setDebugInfo(prev => `${prev}\nVoice initialized successfully!`);
      return true;
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : 'Unknown error';
      console.error('Voice initialization error:', errorMsg);
      setDebugInfo(prev => `${prev}\nInit error: ${errorMsg}`);

      // Don't immediately set as unavailable, as some devices throw errors but still work
      if (initAttempts.current >= 3) {
        setVoiceAvailable(false);
      }
      return false;
    }
  };

  // First initialization attempt
  useEffect(() => {
    initializeVoice();

    // Return cleanup function
    return () => {
      try {
        if (voiceInitialized.current) {
          Voice.destroy().catch(e =>
            console.error('Error destroying Voice:', e),
          );
        }
      } catch (e) {
        console.error('Error in cleanup:', e);
      }
    };
  }, []);

  // Set up Voice listeners when available
  useEffect(() => {
    if (!voiceAvailable) return;

    try {
      console.log('Setting up Voice listeners');
      setDebugInfo(prev => `${prev}\nSetting up listeners`);

      Voice.onSpeechStart = event => {
        console.log('Speech start event:', event);
        setDebugInfo(prev => `${prev}\nSpeech start event`);
        setIsListening(true);
      };

      Voice.onSpeechEnd = () => {
        console.log('Speech ended');
        setDebugInfo(prev => `${prev}\nSpeech ended`);
        setIsListening(false);
      };

      Voice.onSpeechResults = event => {
        if (event && event.value && event.value.length > 0) {
          console.log('Speech results:', event.value);
          setRecognizedText(event.value[0]);
          setDebugInfo(
            prev => `${prev}\nResults: ${event.value[0].substring(0, 20)}...`,
          );
        } else {
          console.warn('Received empty speech results');
          setDebugInfo(prev => `${prev}\nEmpty results received`);
        }
      };

      Voice.onSpeechError = event => {
        const errorMessage = event?.error?.message || 'Unknown error';
        console.error('Speech recognition error:', errorMessage);
        setError(`Recognition error: ${errorMessage}`);
        setDebugInfo(prev => `${prev}\nSpeech error: ${errorMessage}`);
        setIsListening(false);
      };

      listenersAttached.current = true;
      setDebugInfo(prev => `${prev}\nListeners attached successfully!`);
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : 'Unknown error';
      console.error('Error setting up Voice listeners:', errorMsg);
      setDebugInfo(prev => `${prev}\nListener setup error: ${errorMsg}`);
      listenersAttached.current = false;
    }

    return () => {
      if (listenersAttached.current) {
        try {
          Voice.removeAllListeners();
          listenersAttached.current = false;
          console.log('Voice listeners removed');
        } catch (e) {
          console.error('Error removing listeners:', e);
        }
      }
    };
  }, [voiceAvailable]);

  const startListening = async () => {
    setError(null);

    if (!loaded) {
      setError('Audio permissions not granted');
      return;
    }

    // If Voice isn't available yet, try to initialize it one more time
    if (!voiceAvailable) {
      setDebugInfo(prev => `${prev}\nRetrying initialization before start`);
      const initialized = await initializeVoice();
      if (!initialized) {
        setError('Voice recognition is not available on this device');
        return;
      }
    }

    // If listeners aren't attached, try to attach them
    if (!listenersAttached.current) {
      try {
        setDebugInfo(prev => `${prev}\nReattaching listeners before start`);

        Voice.onSpeechStart = event => {
          console.log('Speech started:', event);
          setDebugInfo(prev => `${prev}\nSpeech start`);
          setIsListening(true);
        };

        Voice.onSpeechEnd = () => {
          console.log('Speech ended');
          setDebugInfo(prev => `${prev}\nSpeech end`);
          setIsListening(false);
        };

        Voice.onSpeechResults = event => {
          if (event && event.value) {
            console.log('Results:', event.value);
            setRecognizedText(event.value[0]);
            setDebugInfo(prev => `${prev}\nGot results`);
          }
        };

        Voice.onSpeechError = event => {
          const errorMessage = event?.error?.message || 'Unknown error';
          console.error('Speech error:', errorMessage);
          setError(`Error: ${errorMessage}`);
          setDebugInfo(prev => `${prev}\nSpeech error: ${errorMessage}`);
          setIsListening(false);
        };

        listenersAttached.current = true;
        setDebugInfo(prev => `${prev}\nListeners reattached`);
      } catch (e) {
        console.error('Error reattaching listeners:', e);
        setDebugInfo(
          prev =>
            `${prev}\nFailed to reattach listeners: ${
              e instanceof Error ? e.message : 'Unknown'
            }`,
        );
        setError('Failed to prepare voice recognition');
        return;
      }
    }

    try {
      // Starting with more detailed logging
      setDebugInfo(prev => `${prev}\nAttempting to start recognition...`);

      // Platform-specific handling
      if (Platform.OS === 'android') {
        setDebugInfo(prev => `${prev}\nStarting on Android`);
      } else {
        setDebugInfo(prev => `${prev}\nStarting on iOS`);
      }

      // Check Voice object right before use
      if (!Voice || typeof Voice.start !== 'function') {
        throw new Error('Voice.start is not a function');
      }

      // Start recognition with catch for common errors
      await Voice.start('en-US');
      setIsListening(true);
      setDebugInfo(prev => `${prev}\nRecognition started successfully!`);
    } catch (error) {
      console.error('Failed to start voice recognition:', error);

      // Try to determine the specific error
      let errorMsg = 'Failed to start recognition';
      if (error instanceof Error) {
        errorMsg = error.message;

        // Handle common errors
        if (errorMsg.includes('startSpeech') && errorMsg.includes('null')) {
          // This specific error indicates the native module exists but isn't working
          errorMsg = 'Voice engine unavailable. Try restarting the app.';

          // Clear listeners and try reinitializing
          try {
            Voice.removeAllListeners();
            listenersAttached.current = false;
            setDebugInfo(
              prev => `${prev}\nRemoving listeners to attempt recovery`,
            );
          } catch (e) {
            console.error('Error removing listeners:', e);
          }
        }
      }

      setError(errorMsg);
      setDebugInfo(prev => `${prev}\nStart error: ${errorMsg}`);
      setIsListening(false);
    }
  };

  const stopListening = async () => {
    try {
      setDebugInfo(prev => `${prev}\nAttempting to stop recognition...`);

      if (!Voice || typeof Voice.stop !== 'function') {
        setError('Voice.stop is not a function');
        setDebugInfo(prev => `${prev}\nVoice.stop is not a function!`);
        setIsListening(false);
        return;
      }

      await Voice.stop();
      setIsListening(false);
      setDebugInfo(prev => `${prev}\nRecognition stopped successfully`);
    } catch (error) {
      console.error('Failed to stop voice recognition:', error);
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setError(`Failed to stop: ${errorMsg}`);
      setDebugInfo(prev => `${prev}\nStop error: ${errorMsg}`);

      // Force the listening state to false even if the stop call fails
      setIsListening(false);
    }
  };

  const sendMessage = () => {
    if (recognizedText) {
      setMessages([...messages, {text: recognizedText, type: 'user'}]);
      setRecognizedText('');
    }
  };

  const retryInitialization = async () => {
    setDebugInfo('Retrying Voice initialization...');
    setError(null);

    // Reset state
    setVoiceAvailable(null);
    listenersAttached.current = false;
    voiceInitialized.current = false;

    // Try to initialize again
    const success = await initializeVoice();
    if (success) {
      Alert.alert(
        'Success',
        'Voice recognition has been initialized successfully.',
      );
    } else {
      setError('Failed to initialize Voice recognition');
    }
  };

  return (
    <>
      <Header backButton title="Audio Test" />
      <View style={styles.container}>
        <Text style={[TextStyle.H1B, styles.title]}>Audio Test</Text>

        {error && <Text style={styles.errorText}>{error}</Text>}

        {voiceAvailable === false && (
          <TouchableOpacity
            style={styles.retryButton}
            onPress={retryInitialization}>
            <Text style={styles.retryButtonText}>Retry Initialization</Text>
          </TouchableOpacity>
        )}

        <Text style={[TextStyle.H1B, styles.recognizedText]}>
          {recognizedText || 'Say something...'}
        </Text>

        <View style={styles.controlsContainer}>
          <TouchableOpacity
            style={[
              styles.recordButton,
              isListening && styles.recordingButton,
              (!loaded || voiceAvailable === false) && styles.disabledButton,
            ]}
            disabled={!loaded || voiceAvailable === false}
            onPress={() => (isListening ? stopListening() : startListening())}>
            <Ionicons
              name={isListening ? 'stop' : 'mic'}
              size={32}
              color="white"
            />
          </TouchableOpacity>

          {recognizedText ? (
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <Ionicons name="send" size={24} color="white" />
            </TouchableOpacity>
          ) : null}
        </View>

        {!loaded && (
          <Text style={styles.loadingText}>
            Microphone permissions required
          </Text>
        )}

        {/* Display status info for all users */}
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>
            <Text style={styles.statusLabel}>Status:</Text>
            {voiceAvailable === null
              ? 'Checking Voice availability...'
              : voiceAvailable === true
              ? 'Voice recognition ready'
              : 'Voice recognition unavailable'}
          </Text>
        </View>

        {/* Debug panel - expanded and visible to help troubleshoot */}
        <View style={styles.debugContainer}>
          <Text style={styles.debugHeader}>Debug Info</Text>
          <Text style={styles.debugText}>Platform: {Platform.OS}</Text>
          <Text style={styles.debugText}>
            Voice Available:{' '}
            {voiceAvailable === null
              ? 'Checking...'
              : voiceAvailable
              ? 'YES'
              : 'NO'}
          </Text>
          <Text style={styles.debugText}>
            Permissions: {loaded ? 'Granted' : 'Not Granted'}
          </Text>
          <Text style={styles.debugText}>
            Listeners: {listenersAttached.current ? 'Attached' : 'Not Attached'}
          </Text>
          <Text style={styles.debugText}>
            Initialization: {voiceInitialized.current ? 'Complete' : 'Failed'}
          </Text>
          <Text style={styles.debugText}>Event Log:</Text>
          <Text style={styles.debugEventLog}>{debugInfo}</Text>
        </View>
      </View>
    </>
  );
};

const AudioTestWithProvider = () => {
  return (
    <AudioProvider>
      <AudioTest />
    </AudioProvider>
  );
};

export default AudioTestWithProvider;

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
    marginBottom: 20,
    color: Colors.black,
  },
  recognizedText: {
    fontSize: 18,
    marginBottom: 40,
    color: Colors.black,
    textAlign: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.borderGrey,
    borderRadius: 8,
    minHeight: 100,
    width: '90%',
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.red,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  recordingButton: {
    backgroundColor: '#FF3B30',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
    opacity: 0.6,
  },
  sendButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.black,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  loadingText: {
    marginTop: 20,
    color: Colors.black,
    textAlign: 'center',
  },
  errorText: {
    color: Colors.red,
    marginBottom: 20,
    textAlign: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.red,
    borderRadius: 8,
    backgroundColor: '#FFEEEE',
    width: '90%',
  },
  warningText: {
    color: '#FF9500',
    marginBottom: 20,
    textAlign: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#FF9500',
    borderRadius: 8,
    backgroundColor: '#FFF9EE',
    width: '90%',
  },
  debugContainer: {
    marginTop: 30,
    padding: 10,
    borderWidth: 1,
    borderColor: '#666',
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    width: '90%',
  },
  debugText: {
    fontSize: 12,
    color: '#333',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
});
