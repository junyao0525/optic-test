import React, {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {Animated, StyleSheet, Text, View} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {runOnJS} from 'react-native-reanimated';
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
  onSwipe: (direction: Direction) => void;
  getLandoltCStyle: () => object;
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
  isProcessing?: boolean;
  children?: React.ReactNode;
};

const LandoltCard: React.FC<LandoltCardProps> = ({
  step,
  eye,
  title,
  subTitle,
  instruction,
  onSwipe,
  getLandoltCStyle,
  testInfo,
  feedback,
  isProcessing,
  children,
}) => {
  const swipeGesture = useMemo(() => {
    return Gesture.Pan()
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

        runOnJS(onSwipe)(detectedDirection);
      });
  }, [onSwipe]);

  const {t} = useTranslation();

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

  const {height} = useWindowDimension();

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
                eye === 'LEFT'
                  ? t('landolt.left_eye').replace('：', '')
                  : t('landolt.right_eye').replace('：', ''),
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

        <GestureDetector gesture={swipeGesture}>
          <Animated.View
            style={[
              styles.testArea,
              isProcessing && styles.testAreaProcessing,
            ]}>
            <View style={getLandoltCStyle()} />
            {children}
          </Animated.View>
        </GestureDetector>

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
    color: '#666',
    textAlign: 'center',
    marginBottom: 5,
  },
  attemptsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 5,
  },
  previousLevelText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    fontStyle: 'italic',
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
});

export default LandoltCard;
