import { useCallback, useState } from 'react';
import { EyeResults, FeedbackState, LandoltTestResult, TestState, TestStep } from '../../types/app/landolt';
import { LandoltController } from '../api/LandoltC/controller';
import { Direction, logMARToSnellen, logMarValues } from '../utils/logMar';
import { useDebounce } from './useDebounce';



export const useLandoltTest = () => {
  const [step, setStep] = useState<TestStep>('type');
  const [testType, setTestType] = useState<'swipe' | 'audio' | null>(null);
  const [testState, setTestState] = useState<TestState>({
    level: 1,
    attempts: 0,
    isPreviousLevel: false,
  });
  const [feedback, setFeedback] = useState<FeedbackState>({
    show: false,
    isCorrect: false,
    expectedDirection: null,
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const getRandomDirection: () => Direction = useCallback(() => {
    const directions: Direction[] = ['up', 'right', 'down', 'left'];
    return directions[Math.floor(Math.random() * directions.length)];
  }, []);

  const [direction, setDirection] = useState<Direction>(() => getRandomDirection());

  const [leftEyeResults, setLeftEyeResults] = useState<EyeResults>({
    score: 0,
    finalLevel: 1,
    logMAR: 1.0,
    snellen: '20/200',
  });

  const [rightEyeResults, setRightEyeResults] = useState<EyeResults>({
    score: 0,
    finalLevel: 1,
    logMAR: 1.0,
    snellen: '20/200',
  });

  const resetTestState = useCallback(() => {
    setTestState({
      level: 1,
      attempts: 0,
      isPreviousLevel: false,
    });
  }, []);

  const handleIncorrectAnswer = useCallback((eye: 'left' | 'right') => {
    setTestState(prev => {
      // If we're at the previous level and failed, move to next eye
      if (prev.isPreviousLevel) {
        if (eye === 'left') {
          setStep('right');
        } else {
          setStep('done');
        }
        return {
          level: 1,
          attempts: 0,
          isPreviousLevel: false,
        };
      }

      // If we've had 2 attempts at current level, go back one level
      if (prev.attempts >= 2) {
        return {
          level: Math.max(1, prev.level - 1),
          attempts: 1,
          isPreviousLevel: true,
        };
      }

      // Otherwise, increment attempts at current level
      return {
        ...prev,
        attempts: prev.attempts + 1,
      };
    });
    setDirection(getRandomDirection());
  }, [getRandomDirection]);

  const debouncedProcessInput = useDebounce(500);

  const processInput = useCallback(
    (detectedDirection: Direction) => {
      if (isProcessing) {
        console.log('⚠️ Still processing previous input');
        return;
      }

      setIsProcessing(true);
      const isCorrect = detectedDirection === direction;
      const isLastLevel = testState.level >= Object.keys(logMarValues).length;

      console.log(
        `${testType === 'audio' ? 'Audio' : 'Swipe'}: ${detectedDirection} | Expected: ${direction} | Correct: ${isCorrect}`,
      );

      // Show feedback
      setFeedback({
        show: true,
        isCorrect,
        expectedDirection: direction,
      });

      // Hide feedback after different durations based on correctness
      setTimeout(() => {
        setFeedback(prev => ({ ...prev, show: false }));
      }, 2000);

      debouncedProcessInput(() => {
        const currentStep = step;
        const isLeftEye = currentStep === 'leftTest' || currentStep === 'leftSpeakTest';
        const setResults = isLeftEye ? setLeftEyeResults : setRightEyeResults;

        if (isCorrect) {
          setResults(prev => ({
            ...prev,
            score: prev.score + 1,
            finalLevel: testState.level,
            logMAR: logMarValues[testState.level],
            snellen: logMARToSnellen(logMarValues[testState.level]),
          }));

          if (!isLastLevel) {
            setTestState(prev => ({
              ...prev,
              level: prev.level + 1,
              attempts: 0,
              isPreviousLevel: false,
            }));
          } else {
            console.log(`✅ ${isLeftEye ? 'Left' : 'Right'} eye complete`);
            resetTestState();
            setStep(isLeftEye ? 'right' : 'done');
          }
          setDirection(getRandomDirection());
        } else {
          console.log(`❌ Incorrect ${testType} (${isLeftEye ? 'left' : 'right'} eye)`);
          handleIncorrectAnswer(isLeftEye ? 'left' : 'right');
        }

        console.log({
          step,
          testState,
          leftEyeResults,
          rightEyeResults,
        });

        // Reset processing state after a short delay
        setTimeout(() => {
          setIsProcessing(false);
        }, 100);
      });
    },
    [step, direction, testState, getRandomDirection, handleIncorrectAnswer, resetTestState, debouncedProcessInput, isProcessing, testType],
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
    resetTestState();
  }, [resetTestState]);

  const getTestInfo = useCallback(() => {
    const totalLevels = Object.keys(logMarValues).length;
    const currentLogMAR = logMarValues[testState.level];
    const currentSnellen = logMARToSnellen(currentLogMAR);
    const remainingAttempts = testState.isPreviousLevel ? 1 : 3 - testState.attempts;

    return {
      currentLevel: testState.level,
      totalLevels,
      currentLogMAR,
      currentSnellen,
      remainingAttempts,
      isPreviousLevel: testState.isPreviousLevel,
    };
  }, [testState]);


  //  Supabase function


  const saveTestResults = useCallback(async (
    userId: number,
    leftEyeResults: {
      score: number;
      logMAR: number;
      snellen: string;
    },
    rightEyeResults: {
      score: number;
      logMAR: number;
      snellen: string;
    }
  ) => {
    console.log(testType)
    const testResult: LandoltTestResult = {
      user_id: userId,
      L_score: leftEyeResults.score,
      L_logMar: leftEyeResults.logMAR,
      L_snellen: leftEyeResults.snellen,
      R_score: rightEyeResults.score,
      R_logMar: rightEyeResults.logMAR,
      R_snellen: rightEyeResults.snellen,
      test_type: testType
    };

    return await LandoltController.insertTestResult(testResult);
  }, []);


  const getUserTestResults = useCallback(async (userId: number) => {
    return await LandoltController.getUserTestResults(userId);
  }, []);


  const getTestResultById = useCallback(async (resultId: number) => {
    return await LandoltController.getTestResultById(resultId);
  }, []);



  return {
    step,
    setStep,
    testType,
    direction,
    leftEyeResults,
    rightEyeResults,
    processSwipe: processInput,
    processAudio: processInput,
    handleTestTypeSelection,
    getTestInfo,
    feedback,
    isProcessing,
    saveTestResults,
    getUserTestResults,
    getTestResultById,
  };
}; 