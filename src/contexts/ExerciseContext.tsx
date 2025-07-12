import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Exercise } from '../types';
import exerciseData from '../data/exercises.json';

interface ExerciseState {
  exercises: Exercise[];
  favoriteExercises: string[];
  exerciseHistory: {
    exerciseId: string;
    completedAt: Date;
    rating?: number;
    liked: boolean;
  }[];
  isLoading: boolean;
}

interface ExerciseAction {
  type: 'LOAD_EXERCISES' | 'ADD_FAVORITE' | 'REMOVE_FAVORITE' | 'RECORD_COMPLETION' | 'SET_LOADING';
  payload?: any;
}

const initialState: ExerciseState = {
  exercises: [],
  favoriteExercises: [],
  exerciseHistory: [],
  isLoading: false,
};

const ExerciseContext = createContext<{
  state: ExerciseState;
  dispatch: React.Dispatch<ExerciseAction>;
} | null>(null);

function exerciseReducer(state: ExerciseState, action: ExerciseAction): ExerciseState {
  switch (action.type) {
    case 'LOAD_EXERCISES':
      return {
        ...state,
        exercises: action.payload,
        isLoading: false,
      };
    case 'ADD_FAVORITE':
      return {
        ...state,
        favoriteExercises: [...state.favoriteExercises, action.payload],
      };
    case 'REMOVE_FAVORITE':
      return {
        ...state,
        favoriteExercises: state.favoriteExercises.filter(id => id !== action.payload),
      };
    case 'RECORD_COMPLETION':
      return {
        ...state,
        exerciseHistory: [...state.exerciseHistory, action.payload],
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
}

export function ExerciseProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(exerciseReducer, initialState);

  useEffect(() => {
    dispatch({ type: 'LOAD_EXERCISES', payload: exerciseData });
    
    const savedFavorites = localStorage.getItem('favoriteExercises');
    if (savedFavorites) {
      try {
        const favorites = JSON.parse(savedFavorites);
        favorites.forEach((id: string) => {
          dispatch({ type: 'ADD_FAVORITE', payload: id });
        });
      } catch (error) {
        console.error('Error loading favorite exercises:', error);
      }
    }

    const savedHistory = localStorage.getItem('exerciseHistory');
    if (savedHistory) {
      try {
        const history = JSON.parse(savedHistory);
        history.forEach((entry: any) => {
          dispatch({ type: 'RECORD_COMPLETION', payload: entry });
        });
      } catch (error) {
        console.error('Error loading exercise history:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('favoriteExercises', JSON.stringify(state.favoriteExercises));
  }, [state.favoriteExercises]);

  useEffect(() => {
    localStorage.setItem('exerciseHistory', JSON.stringify(state.exerciseHistory));
  }, [state.exerciseHistory]);

  return (
    <ExerciseContext.Provider value={{ state, dispatch }}>
      {children}
    </ExerciseContext.Provider>
  );
}

export function useExercise() {
  const context = useContext(ExerciseContext);
  if (!context) {
    throw new Error('useExercise must be used within an ExerciseProvider');
  }
  return context;
}