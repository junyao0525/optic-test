import React, {useCallback, useEffect, useState} from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import {useWindowDimension} from '../../../hooks/useWindowDimension';

// const {width, height} = Dimensions.get('window');
const {width, height} = useWindowDimension();

const LandoltCTest = () => {
  // States for tracking test progress
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [gapDirection, setGapDirection] = useState(0); // 0: top, 1: right, 2: bottom, 3: left
  const [cSize, setCSize] = useState(150);
  const [isTestActive, setIsTestActive] = useState(false);

  // Animated values
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const opacity = useSharedValue(1);

  // Calculate gap position based on direction
  const getGapRotation = direction => {
    switch (direction) {
      case 0:
        return '0deg'; // gap at top
      case 1:
        return '90deg'; // gap at right
      case 2:
        return '180deg'; // gap at bottom
      case 3:
        return '270deg'; // gap at left
      default:
        return '0deg';
    }
  };

  // Generate random gap direction
  const generateRandomGap = useCallback(() => {
    const randomDirection = Math.floor(Math.random() * 4);
    setGapDirection(randomDirection);
    rotation.value = withTiming(randomDirection * 90, {
      duration: 500,
      easing: Easing.inOut(Easing.ease),
    });
  }, [rotation]);

  // Handle level progression
  const progressLevel = useCallback(() => {
    if (currentLevel < 10) {
      setCurrentLevel(prev => prev + 1);
      setCSize(prev => Math.max(prev - 10, 40)); // Decrease size as difficulty increases
    } else {
      Alert.alert(
        'Test Complete',
        `Your final score: ${score}/${totalAttempts} (${Math.round(
          (score / totalAttempts) * 100,
        )}%)`,
        [{text: 'Start New Test', onPress: startNewTest}],
      );
      setIsTestActive(false);
    }
  }, [currentLevel, score, totalAttempts]);

  // Process the user's swipe response
  const processResponse = useCallback(
    swipeDirection => {
      setTotalAttempts(prev => prev + 1);

      // Check if swipe direction matches gap direction
      const isCorrect = swipeDirection === gapDirection;

      if (isCorrect) {
        setScore(prev => prev + 1);
        // Visual feedback for correct answer
        scale.value = withSequence(
          withTiming(1.2, {duration: 200}),
          withTiming(1, {duration: 200}),
        );
        // Delay before next question
        setTimeout(() => {
          opacity.value = withTiming(0, {duration: 300}, () => {
            runOnJS(generateRandomGap)();
            opacity.value = withTiming(1, {duration: 300});
          });

          // Progress to next level every 3 correct answers
          if ((score + 1) % 3 === 0) {
            runOnJS(progressLevel)();
          }
        }, 500);
      } else {
        // Visual feedback for incorrect answer
        scale.value = withSequence(
          withTiming(0.8, {duration: 150}),
          withTiming(1, {duration: 150}),
        );

        setTimeout(() => {
          opacity.value = withTiming(0, {duration: 300}, () => {
            runOnJS(generateRandomGap)();
            opacity.value = withTiming(1, {duration: 300});
          });
        }, 500);
      }
    },
    [gapDirection, scale, opacity, generateRandomGap, score, progressLevel],
  );

  // Define swipe gestures
  const swipeGesture = Gesture.Pan().onEnd(event => {
    if (!isTestActive) return;

    const {translationX, translationY} = event;

    // Determine swipe direction
    if (Math.abs(translationX) > Math.abs(translationY)) {
      // Horizontal swipe
      if (translationX > 50) {
        // Right swipe
        runOnJS(processResponse)(1);
      } else if (translationX < -50) {
        // Left swipe
        runOnJS(processResponse)(3);
      }
    } else {
      // Vertical swipe
      if (translationY > 50) {
        // Down swipe
        runOnJS(processResponse)(2);
      } else if (translationY < -50) {
        // Up swipe
        runOnJS(processResponse)(0);
      }
    }
  });

  // Animated styles
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: scale.value}, {rotate: `${rotation.value}deg`}],
      opacity: opacity.value,
    };
  });

  // Start a new test
  const startNewTest = () => {
    setCurrentLevel(1);
    setScore(0);
    setTotalAttempts(0);
    setCSize(150);
    setIsTestActive(true);
    generateRandomGap();
  };

  // Start test on component mount
  useEffect(() => {
    startNewTest();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Landolt C Visual Acuity Test</Text>

      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>Level: {currentLevel}/10</Text>
        <Text style={styles.statsText}>
          Score: {score}/{totalAttempts}
        </Text>
      </View>

      <View style={styles.instructionContainer}>
        <Text style={styles.instruction}>
          Swipe in the direction of the gap in the C
        </Text>
      </View>

      <GestureDetector gesture={swipeGesture}>
        <View style={styles.testArea}>
          <Animated.View style={[styles.landoltCContainer, animatedStyle]}>
            <View style={[styles.landoltC, {width: cSize, height: cSize}]} />
          </Animated.View>
        </View>
      </GestureDetector>

      <TouchableOpacity style={styles.button} onPress={startNewTest}>
        <Text style={styles.buttonText}>
          {isTestActive ? 'Restart Test' : 'Start Test'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20,
  },
  statsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#555',
  },
  instructionContainer: {
    marginBottom: 30,
    padding: 10,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
  },
  instruction: {
    fontSize: 16,
    textAlign: 'center',
    color: '#0d47a1',
  },
  testArea: {
    width: width * 0.8,
    height: height * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  landoltCContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  landoltC: {
    borderWidth: 30,
    borderColor: '#000',
    borderRadius: 100,
    borderTopWidth: 0,
  },
  button: {
    marginTop: 40,
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: '#2196F3',
    borderRadius: 25,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LandoltCTest;
