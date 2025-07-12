import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { BreakSettings, BreakSession } from '../types';
import { defaultBreakSettings } from '../data/defaultSettings';

interface BreakState {
  settings: BreakSettings;
  currentSession: BreakSession | null;
  isBreakActive: boolean;
  nextBreakTime: Date | null;
  breakHistory: BreakSession[];
}

interface BreakAction {
  type: 'UPDATE_SETTINGS' | 'START_BREAK' | 'END_BREAK' | 'UPDATE_SESSION' | 'SET_NEXT_BREAK' | 'LOAD_HISTORY';
  payload?: any;
}

const initialState: BreakState = {
  settings: defaultBreakSettings,
  currentSession: null,
  isBreakActive: false,
  nextBreakTime: null,
  breakHistory: [],
};

const BreakContext = createContext<{
  state: BreakState;
  dispatch: React.Dispatch<BreakAction>;
} | null>(null);

function breakReducer(state: BreakState, action: BreakAction): BreakState {
  switch (action.type) {
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };
    case 'START_BREAK':
      return {
        ...state,
        currentSession: action.payload,
        isBreakActive: true,
      };
    case 'END_BREAK':
      return {
        ...state,
        currentSession: null,
        isBreakActive: false,
        breakHistory: state.currentSession 
          ? [...state.breakHistory, { ...state.currentSession, endTime: new Date() }]
          : state.breakHistory,
      };
    case 'UPDATE_SESSION':
      return {
        ...state,
        currentSession: state.currentSession 
          ? { ...state.currentSession, ...action.payload }
          : null,
      };
    case 'SET_NEXT_BREAK':
      return {
        ...state,
        nextBreakTime: action.payload,
      };
    case 'LOAD_HISTORY':
      return {
        ...state,
        breakHistory: action.payload,
      };
    default:
      return state;
  }
}

export function BreakProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(breakReducer, initialState);

  useEffect(() => {
    const savedSettings = localStorage.getItem('breakSettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
      } catch (error) {
        console.error('Error loading break settings:', error);
      }
    }

    const savedHistory = localStorage.getItem('breakHistory');
    if (savedHistory) {
      try {
        const history = JSON.parse(savedHistory);
        dispatch({ type: 'LOAD_HISTORY', payload: history });
      } catch (error) {
        console.error('Error loading break history:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('breakSettings', JSON.stringify(state.settings));
  }, [state.settings]);

  useEffect(() => {
    localStorage.setItem('breakHistory', JSON.stringify(state.breakHistory));
  }, [state.breakHistory]);

  return (
    <BreakContext.Provider value={{ state, dispatch }}>
      {children}
    </BreakContext.Provider>
  );
}

export function useBreak() {
  const context = useContext(BreakContext);
  if (!context) {
    throw new Error('useBreak must be used within a BreakProvider');
  }
  return context;
}