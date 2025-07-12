import { Exercise, UserProfile, BreakSettings } from '../types';

export interface RecommendationCriteria {
  userProfile: UserProfile;
  breakSettings: BreakSettings;
  timeOfDay: string;
  completedExercises: string[];
  preferredCategories?: string[];
}

export function getRecommendedExercises(
  exercises: Exercise[],
  criteria: RecommendationCriteria,
  count: number = 3
): Exercise[] {
  const {
    userProfile,
    breakSettings,
    timeOfDay,
    completedExercises,
    preferredCategories
  } = criteria;

  let filteredExercises = exercises.filter(exercise => {
    if (completedExercises.includes(exercise.id)) {
      return false;
    }

    if (exercise.duration > breakSettings.duration * 60) {
      return false;
    }

    if (!isDifficultyAppropriate(exercise, userProfile.fitnessLevel)) {
      return false;
    }

    if (hasLimitationConflict(exercise, userProfile.limitations)) {
      return false;
    }

    if (preferredCategories && !preferredCategories.includes(exercise.category)) {
      return false;
    }

    return true;
  });

  filteredExercises = prioritizeByTimeOfDay(filteredExercises, timeOfDay);
  filteredExercises = prioritizeByWorkSetup(filteredExercises, userProfile.workSetup);
  filteredExercises = prioritizeByPreferences(filteredExercises, userProfile.preferredExercises);

  filteredExercises.sort((a, b) => calculateScore(b, criteria) - calculateScore(a, criteria));

  return filteredExercises.slice(0, count);
}

function isDifficultyAppropriate(exercise: Exercise, fitnessLevel: string): boolean {
  const difficultyMap = {
    'beginner': ['easy'],
    'intermediate': ['easy', 'medium'],
    'advanced': ['easy', 'medium', 'hard']
  };

  return difficultyMap[fitnessLevel as keyof typeof difficultyMap]?.includes(exercise.difficulty) || false;
}

function hasLimitationConflict(exercise: Exercise, limitations: string[]): boolean {
  return limitations.some(limitation => {
    const limitationWords = limitation.toLowerCase().split(' ');
    const exerciseText = (exercise.name + ' ' + exercise.description + ' ' + exercise.bodyParts.join(' ')).toLowerCase();
    return limitationWords.some(word => exerciseText.includes(word));
  });
}

function prioritizeByTimeOfDay(exercises: Exercise[], timeOfDay: string): Exercise[] {
  const hour = parseInt(timeOfDay.split(':')[0]);
  
  if (hour < 10) {
    return exercises.sort((a, b) => {
      const aIsEnergizing = a.category === 'cardio' || a.category === 'strength';
      const bIsEnergizing = b.category === 'cardio' || b.category === 'strength';
      return bIsEnergizing ? 1 : aIsEnergizing ? -1 : 0;
    });
  }

  if (hour >= 15) {
    return exercises.sort((a, b) => {
      const aIsRelaxing = a.category === 'stretching' || a.category === 'breathing';
      const bIsRelaxing = b.category === 'stretching' || b.category === 'breathing';
      return bIsRelaxing ? 1 : aIsRelaxing ? -1 : 0;
    });
  }

  return exercises;
}

function prioritizeByWorkSetup(exercises: Exercise[], workSetup: string): Exercise[] {
  return exercises.sort((a, b) => {
    const aIsSeated = a.equipment.includes('chair') || a.instructions.some(i => i.includes('sit'));
    const bIsSeated = b.equipment.includes('chair') || b.instructions.some(i => i.includes('sit'));
    
    if (workSetup === 'desk') {
      return bIsSeated ? 1 : aIsSeated ? -1 : 0;
    }

    return 0;
  });
}

function prioritizeByPreferences(exercises: Exercise[], preferredExercises: string[]): Exercise[] {
  return exercises.sort((a, b) => {
    const aIsPreferred = preferredExercises.includes(a.category);
    const bIsPreferred = preferredExercises.includes(b.category);
    return bIsPreferred ? 1 : aIsPreferred ? -1 : 0;
  });
}

function calculateScore(exercise: Exercise, criteria: RecommendationCriteria): number {
  let score = 0;

  if (criteria.preferredCategories?.includes(exercise.category)) {
    score += 10;
  }

  if (criteria.userProfile.preferredExercises.includes(exercise.category)) {
    score += 8;
  }

  if (exercise.difficulty === 'easy') {
    score += 3;
  } else if (exercise.difficulty === 'medium') {
    score += 5;
  } else {
    score += 2;
  }

  if (exercise.duration <= criteria.breakSettings.duration * 60 * 0.8) {
    score += 5;
  }

  if (exercise.equipment.length === 0) {
    score += 3;
  }

  return score;
}

export function getExercisesByCategory(exercises: Exercise[], category: string): Exercise[] {
  return exercises.filter(exercise => exercise.category === category);
}

export function getExerciseById(exercises: Exercise[], id: string): Exercise | undefined {
  return exercises.find(exercise => exercise.id === id);
}

export function getRandomExercises(exercises: Exercise[], count: number): Exercise[] {
  const shuffled = [...exercises].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}