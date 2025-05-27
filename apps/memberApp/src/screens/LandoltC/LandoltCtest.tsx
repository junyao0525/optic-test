import {useNavigation} from '@react-navigation/native';
import {useCallback, useState} from 'react';
import {Animated, StyleSheet, Text, View} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {runOnJS} from 'react-native-reanimated';
import {useWindowDimension} from '../../../hooks/useWindowDimension';
import BottomButton from '../../components/BottomButton';
import Header from '../../components/Header';
import LandoltInstruction from '../../components/LandoltCInstruction';
import {Colors} from '../../themes';
import {
  calculateSizeFromLogMAR,
  Direction,
  logMARToSnellen,
  logMarValues,
} from '../../utils/logMar';

const LandoltCtest = () => {
  const {width} = useWindowDimension();
  const [step, setStep] = useState<
    'left' | 'leftTest' | 'right' | 'rightTest' | 'done'
  >('left');
  const [currentLevel, setCurrentLevel] = useState(1);
  const navigation = useNavigation();

  const getRandomDirection: () => Direction = useCallback(() => {
    const directions: Direction[] = ['up', 'right', 'down', 'left'];
    return directions[Math.floor(Math.random() * directions.length)];
  }, []);

  const [direction, setDirection] = useState<Direction>(() =>
    getRandomDirection(),
  );

  const [leftEyeResults, setLeftEyeResults] = useState({
    score: 0,
    finalLevel: 1,
    logMAR: 1.0,
    snellen: '20/200',
  });

  const [rightEyeResults, setRightEyeResults] = useState({
    score: 0,
    finalLevel: 1,
    logMAR: 1.0,
    snellen: '20/200',
  });

  const currentSize = calculateSizeFromLogMAR(
    logMarValues[currentLevel],
    width,
  );

  const getLandoltCStyle = () => {
    const baseStyle = {
      width: currentSize,
      height: currentSize,
      borderWidth: currentSize / 5,
      borderColor: '#000',
      borderRadius: currentSize / 2,
    };

    switch (direction) {
      case 'up':
        return {...baseStyle, borderTopWidth: 0};
      case 'right':
        return {...baseStyle, borderRightWidth: 0};
      case 'down':
        return {...baseStyle, borderBottomWidth: 0};
      case 'left':
        return {...baseStyle, borderLeftWidth: 0};
      default:
        return baseStyle;
    }
  };

  // Update test state or advance to next level
  const processSwipe = useCallback(
    (swipeDirection: Direction) => {
      const isCorrect = swipeDirection === direction;
      const isLastLevel = currentLevel >= Object.keys(logMarValues).length;

      console.log(
        `Swipe: ${swipeDirection} | Expected: ${direction} | Correct: ${isCorrect}`,
      );

      switch (step) {
        case 'leftTest':
          setLeftEyeResults(prev => ({
            ...prev,
            score: prev.score + (isCorrect ? 1 : 0),
            finalLevel: isCorrect ? currentLevel : prev.finalLevel,
            logMAR: logMarValues[currentLevel],
            snellen: logMARToSnellen(logMarValues[currentLevel]),
          }));

          if (isCorrect) {
            if (!isLastLevel) {
              setCurrentLevel(prev => prev + 1);
              setDirection(getRandomDirection());
            } else {
              console.log('✅ Left eye complete');
              setCurrentLevel(1);
              setDirection(getRandomDirection());
              setStep('right');
            }
          } else {
            console.log('❌ Incorrect swipe (left eye)');
            // Optional: add retry or decrement logic here
            setCurrentLevel(1);
            setDirection(getRandomDirection());
            setStep('right');
          }
          break;

        case 'rightTest':
          setRightEyeResults(prev => ({
            ...prev,
            score: prev.score + (isCorrect ? 1 : 0),
            finalLevel: isCorrect ? currentLevel : prev.finalLevel,
            logMAR: logMarValues[currentLevel],
            snellen: logMARToSnellen(logMarValues[currentLevel]),
          }));

          if (isCorrect) {
            if (!isLastLevel) {
              setCurrentLevel(prev => prev + 1);
              setDirection(getRandomDirection());
            } else {
              console.log('✅ Right eye complete');
              setCurrentLevel(1);
              setDirection(getRandomDirection());
              setStep('done');
            }
          } else {
            console.log('❌ Incorrect swipe (right eye)');
            // Optional: add retry or decrement logic here
            setCurrentLevel(1);
            setDirection(getRandomDirection());
            setStep('done');
          }
          break;

        default:
          console.warn(`⚠️ Unhandled step: ${step}`);
          break;
      }

      console.log({
        step,
        currentLevel,
        leftEyeResults,
        rightEyeResults,
      });
    },
    [step, direction, currentLevel, getRandomDirection],
  );

  const swipeGesture = Gesture.Pan()
    .activateAfterLongPress(0)
    .onEnd(e => {
      'worklet';
      const {translationX, translationY} = e;

      let detectedDirection: Direction;

      if (Math.abs(translationX) > Math.abs(translationY)) {
        detectedDirection = translationX > 0 ? 'right' : 'left';
      } else {
        detectedDirection = translationY > 0 ? 'down' : 'up';
      }

      runOnJS(processSwipe)(detectedDirection);
    });

  return (
    <>
      {step === 'left' && (
        <LandoltInstruction eye="left" onContinue={() => setStep('leftTest')} />
      )}

      {step === 'right' && (
        <LandoltInstruction
          eye="right"
          onContinue={() => setStep('rightTest')}
        />
      )}

      {step === 'done' && (
        <>
          <Header backHomeButton title="Test Complete" />
          <View style={styles.container}>
            {/* <Text style={styles.title}>Landolt C Visual Acuity Test</Text> */}
            <View style={styles.resultContainer}>
              <Text style={styles.resultTitle}>Visual Acuity Results</Text>

              <View style={styles.eyeResultContainer}>
                <Text style={styles.eyeTitle}>Left Eye:</Text>
                <Text style={styles.acuityValue}>
                  Score:{' '}
                  {leftEyeResults.score +
                    '/' +
                    Object.keys(logMarValues).length}
                </Text>
                <Text style={styles.acuityValue}>
                  LogMAR: {leftEyeResults.logMAR.toFixed(1)}
                </Text>

                <Text style={styles.acuityValue}>
                  Snellen: {leftEyeResults.snellen}
                </Text>
                <Text style={styles.acuityDesc}>
                  {leftEyeResults.logMAR <= 0.0
                    ? 'Normal vision'
                    : leftEyeResults.logMAR <= 0.3
                    ? 'Mild visual impairment'
                    : leftEyeResults.logMAR <= 0.7
                    ? 'Moderate impairment'
                    : // leftEyeResults.logMAR <= 1.0
                      'Poor'}
                </Text>
              </View>

              <View style={styles.eyeResultContainer}>
                <Text style={styles.eyeTitle}>Right Eye:</Text>
                <Text style={styles.acuityValue}>
                  Score:{' '}
                  {rightEyeResults.score +
                    '/' +
                    Object.keys(logMarValues).length}
                </Text>
                <Text style={styles.acuityValue}>
                  LogMAR: {rightEyeResults.logMAR.toFixed(1)}
                </Text>

                <Text style={styles.acuityValue}>
                  Snellen: {rightEyeResults.snellen}
                </Text>
                <Text style={styles.acuityDesc}>
                  {rightEyeResults.logMAR <= 0.0
                    ? 'Normal vision'
                    : rightEyeResults.logMAR <= 0.3
                    ? 'Mild visual impairment'
                    : rightEyeResults.logMAR <= 0.7
                    ? 'Moderate impairment'
                    : // rightEyeResults.logMAR <= 1.0
                      'Poor'}
                </Text>
              </View>

              <Text style={styles.disclaimer}>
                This test is not a substitute for a professional eye exam.
                Please consult with an eye care professional for accurate
                results.
              </Text>
            </View>
          </View>
          <BottomButton
            title="Go to Home"
            onPress={() => navigation.navigate('Home')}
          />
        </>
      )}

      {(step === 'leftTest' || step === 'rightTest') && (
        <>
          <Header backHomeButton title="Landolt C Test" />
          <View style={styles.container}>
            <Text style={styles.title}>Landolt C Visual Acuity Test</Text>
            <View style={styles.testInfo}>
              <Text style={styles.eyeIndicator}>
                Testing: {step === 'rightTest' ? 'RIGHT' : 'LEFT'} eye
                {step === 'rightTest'
                  ? ' (cover left eye)'
                  : ' (cover right eye)'}
              </Text>
            </View>
            <View style={styles.instructionContainer}>
              <Text style={styles.instruction}>
                Swipe in the direction of the gap in the C
              </Text>
            </View>

            <GestureDetector gesture={swipeGesture}>
              <Animated.View style={styles.testArea}>
                <View style={getLandoltCStyle()} />
                {/* {feedback && (
                  <Text style={styles.feedbackText}>{feedback}</Text>
                )} */}
              </Animated.View>
            </GestureDetector>
          </View>
          <BottomButton
            title={step === 'leftTest' ? 'Continue' : 'View Results'}
            onPress={() => {
              if (step === 'leftTest') {
                setStep('right');
              } else if (step === 'rightTest') {
                setStep('done');
              }
            }}
          />
        </>
      )}
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  statsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
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
    height: '40%',
    backgroundColor: '#fff',
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  feedbackText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#333',
  },
  instructionPanel: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  instructionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: Colors.darkGreen,
  },
  instructionText: {
    fontSize: 16,
    marginBottom: 12,
    color: '#444',
  },
  startButton: {
    backgroundColor: Colors.darkGreen,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 15,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  resultContainer: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: Colors.darkGreen,
  },
  eyeResultContainer: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  eyeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  acuityValue: {
    fontSize: 16,
    marginBottom: 5,
    color: '#444',
  },
  acuityDesc: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.darkGreen,
    marginTop: 5,
  },
  disclaimer: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#777',
    textAlign: 'center',
    marginVertical: 15,
  },
  resetButton: {
    backgroundColor: Colors.darkGreen,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: 'center',
  },
});

export default LandoltCtest;
