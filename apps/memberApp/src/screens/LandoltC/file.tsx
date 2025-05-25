import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {runOnJS} from 'react-native-reanimated';
import {useWindowDimension} from '../../../hooks/useWindowDimension';
import Header from '../../components/Header';
import {Colors} from '../../themes';
import {logMARToSnellen, logMarValues} from '../../utils/logMar';

const LandoltCtest = () => {
  const {width} = useWindowDimension();

  const [currentEye, setCurrentEye] = useState('right');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [direction, setDirection] = useState('up');
  const [feedback, setFeedback] = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [testComplete, setTestComplete] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [rightEyeResults, setRightEyeResults] = useState({
    score: 0,
    maxLevel: 0,
    logMAR: 1.0,
    snellen: '20/200',
  });

  const [leftEyeResults, setLeftEyeResults] = useState({
    score: 0,
    maxLevel: 0,
    logMAR: 1.0,
    snellen: '20/200',
  });

  const getRandomDirection = useCallback(() => {
    const directions = ['up', 'right', 'down', 'left'];
    return directions[Math.floor(Math.random() * 4)];
  }, []);

  // Initialize the test
  useEffect(() => {
    if (testStarted) {
      setDirection(getRandomDirection());
    }
  }, [testStarted, getRandomDirection]);

  // Update test state or advance to next level
  const processSwipe = useCallback(
    swipeDirection => {
      if (!testStarted || attemptsLeft <= 0) return;

      const correct = swipeDirection === direction;

      // Update the current eye's score
      if (currentEye === 'right') {
        if (correct) {
          setRightEyeResults(prev => ({
            ...prev,
            score: prev.score + 1,
          }));
        }
      } else {
        if (correct) {
          setLeftEyeResults(prev => ({
            ...prev,
            score: prev.score + 1,
          }));
        }
      }

      setFeedback(correct ? 'Correct!' : 'Incorrect!');
      setAttemptsLeft(prev => prev - 1);

      setTimeout(() => {
        if (attemptsLeft <= 1) {
          const correctThreshold = 2;
          const currentScore =
            currentEye === 'right'
              ? rightEyeResults.score
              : leftEyeResults.score;

          const lastLevelScore = currentScore % 3;

          if (lastLevelScore >= correctThreshold) {
            if (currentLevel < Object.keys(logMarValues).length) {
              setCurrentLevel(prev => prev + 1);
              setAttemptsLeft(3);
              setDirection(getRandomDirection());
              setFeedback('');
            } else {
              finishCurrentEyeTest();
            }
          } else {
            finishCurrentEyeTest();
          }
        } else {
          setDirection(getRandomDirection());
          setFeedback('');
        }
      }, 1000);
    },
    [
      attemptsLeft,
      currentEye,
      currentLevel,
      direction,
      getRandomDirection,
      rightEyeResults.score,
      leftEyeResults.score,
    ],
  );

  // Finish testing the current eye
  const finishCurrentEyeTest = () => {
    const logMAR = logMarValues[currentLevel];
    const snellen = logMARToSnellen(logMAR);

    if (currentEye === 'right') {
      setRightEyeResults(prev => ({
        ...prev,
        maxLevel: currentLevel,
        logMAR: logMAR,
        snellen: snellen,
      }));

      // Switch to left eye
      setCurrentEye('left');
      setCurrentLevel(1);
      setAttemptsLeft(3);
      setDirection(getRandomDirection());
      setFeedback('');
    } else {
      // Both eyes are done
      setLeftEyeResults(prev => ({
        ...prev,
        maxLevel: currentLevel,
        logMAR: logMAR,
        snellen: snellen,
      }));
      setTestComplete(true);
    }
  };

  // Get current Landolt C size based on level
  const currentSize = calculateSizeFromLogMAR(
    logMarValues[currentLevel],
    width,
  );

  // Setup swipe gestures
  const swipeGesture = Gesture.Pan()
    .activateAfterLongPress(0)
    .onEnd(e => {
      'worklet';
      const {translationX, translationY} = e;

      let swipeDirection;
      // Determine swipe direction based on the largest absolute movement
      if (Math.abs(translationX) > Math.abs(translationY)) {
        swipeDirection = translationX > 0 ? 'right' : 'left';
      } else {
        swipeDirection = translationY > 0 ? 'down' : 'up';
      }

      runOnJS(processSwipe)(swipeDirection);
    });

  // Generate the appropriate styles for the Landolt C based on direction
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

  const startTest = () => {
    setTestStarted(true);
    setRightEyeResults({
      score: 0,
      maxLevel: 0,
      logMAR: 1.0,
      snellen: '20/200',
    });
    setLeftEyeResults({
      score: 0,
      maxLevel: 0,
      logMAR: 1.0,
      snellen: '20/200',
    });
    setCurrentEye('right');
    setCurrentLevel(1);
    setAttemptsLeft(3);
    setDirection(getRandomDirection());
    setFeedback('');
    setTestComplete(false);
  };

  const resetTest = () => {
    setTestStarted(false);
    setTestComplete(false);
  };

  return (
    <>
      <Header
        backHomeButton
        title={'Landolt C Test'}
        headerColor={Colors.white}
      />
      <View style={styles.container}>
        <Text style={styles.title}>Landolt C Visual Acuity Test</Text>

        {!testStarted && !testComplete ? (
          <View style={styles.instructionPanel}>
            <Text style={styles.instructionTitle}>Test Instructions</Text>
            <Text style={styles.instructionText}>
              1. Cover your left eye first - we'll test your right eye
            </Text>
            <Text style={styles.instructionText}>
              2. Swipe in the direction of the gap in the C
            </Text>
            <Text style={styles.instructionText}>
              3. After testing your right eye, we'll test your left eye
            </Text>
            <Text style={styles.instructionText}>
              4. Please ensure you're at a comfortable viewing distance
            </Text>
            <TouchableOpacity style={styles.startButton} onPress={startTest}>
              <Text style={styles.buttonText}>Start Test</Text>
            </TouchableOpacity>
          </View>
        ) : testComplete ? (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>Visual Acuity Results</Text>

            <View style={styles.eyeResultContainer}>
              <Text style={styles.eyeTitle}>Right Eye:</Text>
              <Text style={styles.acuityValue}>
                LogMAR: {rightEyeResults.logMAR.toFixed(1)}
              </Text>
              <Text style={styles.acuityValue}>
                Snellen: {rightEyeResults.snellen}
              </Text>
              <Text style={styles.acuityDesc}>
                {rightEyeResults.logMAR <= 0.0
                  ? 'Excellent'
                  : rightEyeResults.logMAR <= 0.3
                  ? 'Good'
                  : rightEyeResults.logMAR <= 0.5
                  ? 'Fair'
                  : 'Poor'}
              </Text>
            </View>

            <View style={styles.eyeResultContainer}>
              <Text style={styles.eyeTitle}>Left Eye:</Text>
              <Text style={styles.acuityValue}>
                LogMAR: {leftEyeResults.logMAR.toFixed(1)}
              </Text>
              <Text style={styles.acuityValue}>
                Snellen: {leftEyeResults.snellen}
              </Text>
              <Text style={styles.acuityDesc}>
                {leftEyeResults.logMAR <= 0.0
                  ? 'Excellent'
                  : leftEyeResults.logMAR <= 0.3
                  ? 'Good'
                  : leftEyeResults.logMAR <= 0.5
                  ? 'Fair'
                  : 'Poor'}
              </Text>
            </View>

            <Text style={styles.disclaimer}>
              This test is not a substitute for a professional eye exam. Please
              consult with an eye care professional for accurate results.
            </Text>

            <TouchableOpacity style={styles.resetButton} onPress={resetTest}>
              <Text style={styles.buttonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.testInfo}>
              <Text style={styles.eyeIndicator}>
                Testing: {currentEye === 'right' ? 'RIGHT' : 'LEFT'} eye
                {currentEye === 'right'
                  ? ' (cover left eye)'
                  : ' (cover right eye)'}
              </Text>

              <View style={styles.statsContainer}>
                <Text style={styles.statsText}>
                  Level: {currentLevel}/{Object.keys(logMarValues).length}
                </Text>
                <Text style={styles.statsText}>
                  LogMAR: {logMarValues[currentLevel].toFixed(1)}
                </Text>
                <Text style={styles.statsText}>
                  Snellen: {logMARToSnellen(logMarValues[currentLevel])}
                </Text>
              </View>
            </View>

            <View style={styles.instructionContainer}>
              <Text style={styles.instruction}>
                Swipe in the direction of the gap in the C
              </Text>
            </View>

            <GestureDetector gesture={swipeGesture}>
              <Animated.View style={styles.testArea}>
                <View style={getLandoltCStyle()} />
                {feedback && (
                  <Text style={styles.feedbackText}>{feedback}</Text>
                )}
              </Animated.View>
            </GestureDetector>
          </>
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
