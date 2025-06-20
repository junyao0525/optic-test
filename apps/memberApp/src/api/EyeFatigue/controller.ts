import {supabase} from '../../config';

export interface FatigueResult {
  user_id: number;
  perclos: string;
  avg_blink: string;
  ear_mean: string;
  ear_std: string;
  blink_rate: string;
  class: string;
}

export interface FatigueResultResponse {
  id: number;
  user_id: number;
  perclos: string;
  avg_blink: string;
  ear_mean: string;
  ear_std: string;
  blink_rate: string;
  class: string;
  created_at: string;
}

export const FatigueController = {
  /**
   * Insert a new Landolt test result
   */
  insertTestResult: async (
    testResult: FatigueResult,
  ): Promise<
    | {success: true; data: FatigueResultResponse}
    | {success: false; message: string}
  > => {
    try {
      const {data, error} = await supabase
        .from('EyeFatigue') // Replace with your actual table name
        .insert([testResult])
        .select()
        .single();

      if (error) {
        console.error('Error inserting test result:', error);
        return {
          success: false,
          message: error.message || 'Failed to insert test result',
        };
      }

      return {
        success: true,
        data: data as FatigueResultResponse,
      };
    } catch (err: any) {
      console.error('Exception inserting test result:', err);
      return {
        success: false,
        message: err.message || 'Failed to insert test result',
      };
    }
  },

  /**
   * Get test results for a specific user
   */
  getUserTestResults: async (
    userId: number,
  ): Promise<
    | {success: true; data: FatigueResultResponse[]}
    | {success: false; message: string}
  > => {
    try {
      const {data, error} = await supabase
        .from('EyeFatigue') // Replace with your actual table name
        .select('*')
        .eq('user_id', userId)
        .order('created_at', {ascending: false});

      if (error) {
        console.error('Error fetching test results:', error);
        return {
          success: false,
          message: error.message || 'Failed to fetch test results',
        };
      }

      return {
        success: true,
        data: data as FatigueResultResponse[],
      };
    } catch (err: any) {
      console.error('Exception fetching test results:', err);
      return {
        success: false,
        message: err.message || 'Failed to fetch test results',
      };
    }
  },

  /**
   * Get a specific test result by ID
   */
  getTestResultById: async (
    resultId: number,
  ): Promise<
    | {success: true; data: FatigueResultResponse}
    | {success: false; message: string}
  > => {
    try {
      const {data, error} = await supabase
        .from('EyeFatigue') // Replace with your actual table name
        .select('*')
        .eq('id', resultId)
        .single();

      if (error) {
        console.error('Error fetching test result:', error);
        return {
          success: false,
          message: error.message || 'Failed to fetch test result',
        };
      }

      return {
        success: true,
        data: data as FatigueResultResponse,
      };
    } catch (err: any) {
      console.error('Exception fetching test result:', err);
      return {
        success: false,
        message: err.message || 'Failed to fetch test result',
      };
    }
  },

  /**
   * Delete a test result
   */
  deleteTestResult: async (
    resultId: number,
  ): Promise<{success: true} | {success: false; message: string}> => {
    try {
      const {error} = await supabase
        .from('EyeFatigue') // Replace with your actual table name
        .delete()
        .eq('id', resultId);

      if (error) {
        console.error('Error deleting test result:', error);
        return {
          success: false,
          message: error.message || 'Failed to delete test result',
        };
      }

      return {
        success: true,
      };
    } catch (err: any) {
      console.error('Exception deleting test result:', err);
      return {
        success: false,
        message: err.message || 'Failed to delete test result',
      };
    }
  },
};
