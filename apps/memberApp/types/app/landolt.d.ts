export interface LandoltTestResult {
    user_id: number;
    L_score: number;
    L_logMar: number;
    L_snellen: string;
    R_score: number;
    R_logMar: number;
    R_snellen: string;
    test_type: string | null;
  }
  
  // Interface for the database response
export interface LandoltTestResultResponse {
    id: number;
    user_id: number;
    L_score: number;
    L_logMar: number;
    L_snellen: string;
    R_score: number;
    R_logMar: number;
    R_snellen: string;
    test_type : string | null;
    created_at: string;
}

export interface EyeResults {
    score: number;
    finalLevel: number;
    logMAR: number;
    snellen: string;
}

export type TestStep = 'type' | 'left' | 'leftTest' | 'right' | 'rightTest' | 'done' | 'leftSpeakTest' | 'rightSpeakTest';

export interface TestState {
    level: number;
    attempts: number;
    isPreviousLevel: boolean;
}

export interface FeedbackState {
    show: boolean;
    isCorrect: boolean;
    expectedDirection: Direction | null;
}