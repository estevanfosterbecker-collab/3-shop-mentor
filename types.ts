
export interface UserState {
  hasPaid: boolean;
  isTikTokConnected: boolean;
  tiktokAccessToken?: string;
  tiktokHandle?: string;
  onboardingStep: 'landing' | 'auth' | 'choice' | 'quiz' | 'upload' | 'checkout' | 'tiktok_connect' | 'dashboard';
  quizAnswers: Record<number, string[]>;
  points: number;
  level: number;
  levelName: string;
  streak: number;
  lastLoginDate: string;
  totalTasksCompleted: number;
  badges: Badge[];
  challenges: Challenge[];
  profileImageUrl?: string;
  analysis?: ProfileAnalysis;
  dailyTasks: Task[];
  notifications: AppNotification[];
  email?: string;
  savedPrompts?: SavedPrompt[];
}

export interface SavedPrompt {
  id: string;
  name: string;
  objective: string;
  format: string;
  style: string;
  duration: string;
  language: string;
  description: string;
  suggestions: string[];
  finalPrompt: string;
  createdAt: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface Challenge {
  id: string;
  title: string;
  progress: number;
  target: number;
  xpReward: number;
  completed: boolean;
}

export interface AppNotification {
  id: string;
  type: 'execution' | 'consistency' | 'progress' | 'strategic' | 'error';
  message: string;
  timestamp: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  points: number;
  isVerifying?: boolean;
  needsTikTokValidation: boolean;
  validationStatus?: 'pending' | 'validated' | 'failed';
}

export interface ProfileAnalysis {
  score: number;
  strengths: string[];
  weaknesses: string[];
  strategicActionPlan: string[];
  viralPotential: string;
}

export interface CaseStudy {
  name: string;
  revenue: string;
  growth: string;
  image: string;
  quote: string;
}

export interface Question {
  id: number;
  text: string;
  options: string[];
}
