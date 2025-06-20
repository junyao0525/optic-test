import {useCallback} from 'react';
import {FatigueController} from '../api/EyeFatigue/controller';

export const useFatigue = () => {
  const getUserTestResults = useCallback(async (userId: number) => {
    return await FatigueController.getUserTestResults(userId);
  }, []);

  const getTestResultById = useCallback(async (resultId: number) => {
    return await FatigueController.getTestResultById(resultId);
  }, []);

  return {
    getUserTestResults,
    getTestResultById,
  };
};
