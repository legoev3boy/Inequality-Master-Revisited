
export interface User {
  username: string;
  email: string;
  isVerified: boolean;
}

export interface Character {
  name: string;
  avatar: string;
  color: string;
  unlockedItems: string[];
}

export interface MathProblem {
  id: string;
  context: string;
  variableName: string;
  variableDescription: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  level: number;
  keyFacts?: string[];
}

export interface EvaluationResult {
  isCorrect: boolean;
  feedback: string;
  correctInequality: string;
  tips: string[];
}

export interface UserHistoryItem {
  problemId: string;
  isCorrect: boolean;
  timestamp: number;
  level: number;
  pointsEarned?: number;
}

export interface MistakeRecord {
  id: string;
  problem: MathProblem;
  studentInequality: string;
  timestamp: number;
  correctInequality: string;
}

export interface DailyStats {
  [date: string]: {
    correct: number;
    incorrect: number;
    points: number;
  };
}
