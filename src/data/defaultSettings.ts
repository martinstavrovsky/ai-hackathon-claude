import { BreakSettings, UserProfile } from '../types';

export const defaultBreakSettings: BreakSettings = {
  frequency: 60,
  duration: 5,
  enableNotifications: true,
  enableScreenLock: false,
  autoStart: false,
  soundEnabled: true,
  volume: 0.5,
};

export const defaultUserProfile: Partial<UserProfile> = {
  fitnessLevel: 'beginner',
  limitations: [],
  preferredExercises: [],
  workSetup: 'desk',
  workSchedule: {
    startTime: '09:00',
    endTime: '17:00',
    lunchBreak: { start: '12:00', end: '13:00' },
  },
  workdayIntegration: {
    enabled: false,
    employeeId: '',
    lastSync: new Date(),
    syncFrequency: 'daily',
  },
};