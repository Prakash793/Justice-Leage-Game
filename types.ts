
export type Role = 'Advocate' | 'Public Prosecutor' | 'Judge';

export interface User {
  id: string;
  email: string;
  name: string;
  totalPoints: number;
  completedQuizzes: number;
  casesResolved: number;
  rank: string;
}

export interface CaseScenario {
  id: string;
  title: string;
  category: 'IPC' | 'CrPC' | 'CPC' | 'Constitution';
  brief: string;
  facts: string[];
  parties: { petitioner: string; respondent: string };
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  tamilExplanation?: string;
  lawSection: string;
}

export interface CourtroomState {
  currentPhase: 'Brief' | 'Selection' | 'Arguments' | 'Verdict';
  role: Role | null;
  selectedSections: string[];
  arguments: string[];
  objectionsRaised: number;
  aiResponse: string;
  score: number;
}
