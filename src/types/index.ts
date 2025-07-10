export interface UserProfile {
  id: string;
  name: string;
  age: number;
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  limitations: string[];
  preferredExercises: string[];
  workSetup: 'desk' | 'standing' | 'hybrid';
  workSchedule: {
    startTime: string;
    endTime: string;
    lunchBreak: { start: string; end: string; };
  };
  workdayIntegration: {
    enabled: boolean;
    employeeId: string;
    lastSync: Date;
    syncFrequency: 'hourly' | 'daily';
  };
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  instructions: string[];
  duration: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  bodyParts: string[];
  equipment: string[];
  imageUrl?: string;
}

export interface BreakSettings {
  frequency: number;
  duration: number;
  enableNotifications: boolean;
  enableScreenLock: boolean;
  autoStart: boolean;
  soundEnabled: boolean;
  volume: number;
}

export interface WorkdaySchedule {
  date: string;
  workingHours: {
    start: string;
    end: string;
    totalHours: number;
  };
  meetings: WorkdayMeeting[];
  timeOff: {
    type: 'PTO' | 'sick' | 'personal' | 'holiday';
    duration: 'full-day' | 'partial';
    hours?: number;
  } | null;
  workload: 'light' | 'moderate' | 'heavy';
}

export interface WorkdayMeeting {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  type: 'meeting' | 'focus-time' | 'break' | 'lunch';
  participants: number;
  isOptional: boolean;
  location: 'office' | 'remote' | 'hybrid';
}

export interface SmartBreakRecommendation {
  suggestedTime: string;
  duration: number;
  reasoning: string;
  exercises: Exercise[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  contextInfo: {
    nextMeeting?: string;
    workloadLevel: string;
    timeSinceLastBreak: number;
    stressIndicators: string[];
  };
}

export interface BreakSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  exercises: Exercise[];
  completedExercises: string[];
  skipped: boolean;
  feedback?: {
    rating: number;
    liked: boolean;
    comments?: string;
  };
}

export interface ProgressData {
  daily: {
    date: string;
    breaksTaken: number;
    breaksScheduled: number;
    exercisesCompleted: number;
    totalBreakTime: number;
    streak: number;
  };
  weekly: {
    weekStart: string;
    totalBreaks: number;
    totalExercises: number;
    favoriteExercises: string[];
    averageRating: number;
  };
  monthly: {
    month: string;
    totalBreaks: number;
    improvementMetrics: {
      consistencyScore: number;
      varietyScore: number;
      engagementScore: number;
    };
  };
}

export interface AppState {
  user: UserProfile | null;
  settings: BreakSettings;
  currentBreak: BreakSession | null;
  isBreakActive: boolean;
  progress: ProgressData;
  exercises: Exercise[];
  workdaySchedule: WorkdaySchedule | null;
}