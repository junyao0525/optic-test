import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { useWindowDimension } from '../../../hooks/useWindowDimension';
import BottomButton from '../../components/BottomButton';
import Header from '../../components/Header';
import LandoltAudioCard from '../../components/LandoltAudioCard';
import LandoltCard from '../../components/landoltCard';
import LandoltInstruction from '../../components/LandoltCInstruction';
import TestCard from '../../components/TestCard';
import { Colors } from '../../themes';
import {
  calculateSizeFromLogMAR,
  Direction,
  logMARToSnellen,
  logMarValues,
} from '../../utils/logMar';

const LandoltCtest = () => {
  const {width} = useWindowDimension();
  const [step, setStep] = useState<
    | 'type'
    | 'left'
    | 'leftTest'
    | 'right'
    | 'rightTest'
    | 'done'
    | 'leftSpeakTest'
    | 'rightSpeakTest'
  >('type');
  const [currentLevel, setCurrentLevel] = useState(1);
  const navigation = useNavigation<NavigationProp<TabParamList>>();
  const [testType, setTestType] = useState<'swipe' | 'audio' | null>(null);
  const {t} = useTranslation();

  const swipeTestImage = require('../../../assets/images/LandoltCtestType/swipe-test.png');
  const speakTestImage = require('../../../assets/images/LandoltCtestType/speak-test.png');

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

  const handleTestTypeSelection = useCallback((type: string) => {
    console.log(`Selected test type: ${type}`);
    if (type === 'swipe') {
      setTestType('swipe');
      setStep('left');
    } else if (type === 'audio') {
      setTestType('audio');
      setStep('left');
    }
  }, []);

  return (
    <>
      {step === 'type' && (
        <>
          <View style={styles.container}>
            <Text style={styles.resultTitle}>{t('landolt.select_test_type')}</Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                gap: 10,
              }}>
              <TestCard
                title={t('landolt.swipe_test')}
                image={swipeTestImage} // Replace with your image
                onPress={() => {
                  // setTestType('swipe');
                  handleTestTypeSelection('swipe');
                }}
                gradient={['#E3F2FD', '#2196F3']}
                icon="👆"
              />

              <TestCard
                title={t('landolt.speak_test')}
                image={speakTestImage} // Replace with your image
                onPress={() => {
                  handleTestTypeSelection('audio');
                }}
                gradient={['#E3F2FD', '#2196F3']}
                icon="🎵"
              />
            </View>
          </View>
        </>
      )}

      {step === 'left' && (
        <LandoltInstruction
          eye="left"
          onContinue={() =>
            testType === 'swipe'
              ? setStep('leftTest')
              : setStep('leftSpeakTest')
          }
        />
      )}

      {step === 'right' && (
        <LandoltInstruction
          eye="right"
          onContinue={() =>
            testType === 'swipe'
              ? setStep('rightTest')
              : setStep('rightSpeakTest')
          }
        />
      )}

      {step === 'done' && (
        <>
          <Header backHomeButton title={t('landolt.test_complete')} />
          <View style={styles.container}>
            <View style={styles.resultContainer}>
              <Text style={styles.resultTitle}>{t('landolt.visual_acuity_results')}</Text>

              <View style={styles.eyeResultContainer}>
                <Text style={styles.eyeTitle}>{t('landolt.left_eye')}</Text>
                <Text style={styles.acuityValue}>
                  {t('landolt.score')}{' '}
                  {leftEyeResults.score +
                    '/' +
                    Object.keys(logMarValues).length}
                </Text>
                <Text style={styles.acuityValue}>
                  {t('landolt.logmar')} {leftEyeResults.logMAR.toFixed(1)}
                </Text>

                <Text style={styles.acuityValue}>
                  {t('landolt.snellen')} {leftEyeResults.snellen}
                </Text>
                <Text style={styles.acuityDesc}>
                  {leftEyeResults.logMAR <= 0.0
                    ? t('landolt.vision_status.normal')
                    : leftEyeResults.logMAR <= 0.3
                    ? t('landolt.vision_status.mild')
                    : leftEyeResults.logMAR <= 0.7
                    ? t('landolt.vision_status.moderate')
                    : t('landolt.vision_status.poor')}
                </Text>
              </View>

              <View style={styles.eyeResultContainer}>
                <Text style={styles.eyeTitle}>{t('landolt.right_eye')}</Text>
                <Text style={styles.acuityValue}>
                  {t('landolt.score')}{' '}
                  {rightEyeResults.score +
                    '/' +
                    Object.keys(logMarValues).length}
                </Text>
                <Text style={styles.acuityValue}>
                  {t('landolt.logmar')} {rightEyeResults.logMAR.toFixed(1)}
                </Text>

                <Text style={styles.acuityValue}>
                  {t('landolt.snellen')} {rightEyeResults.snellen}
                </Text>
                <Text style={styles.acuityDesc}>
                  {rightEyeResults.logMAR <= 0.0
                    ? t('landolt.vision_status.normal')
                    : rightEyeResults.logMAR <= 0.3
                    ? t('landolt.vision_status.mild')
                    : rightEyeResults.logMAR <= 0.7
                    ? t('landolt.vision_status.moderate')
                    : t('landolt.vision_status.poor')}
                </Text>
              </View>

              <Text style={styles.disclaimer}>
                {t('landolt.disclaimer')}
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
        <LandoltCard
          step={step}
          eye={step === 'rightTest' ? 'RIGHT' : 'LEFT'}
          title={t('landolt.title')}
          instruction={t('landolt.swipe_instruction')}
          getLandoltCStyle={getLandoltCStyle}
          onSwipe={processSwipe}
        />
      )}

      {(step === 'leftSpeakTest' || step === 'rightSpeakTest') && (
        <LandoltAudioCard
          step={step}
          eye={step === 'leftSpeakTest' ? 'RIGHT' : 'LEFT'}
          title={t('landolt.title')}
          instruction={t('landolt.speak_instruction')}
          getLandoltCStyle={getLandoltCStyle}
        />
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
  cardsContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 16,
  },
});

export default LandoltCtest;
