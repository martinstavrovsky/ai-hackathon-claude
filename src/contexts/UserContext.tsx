import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { UserProfile } from '../types';
import { defaultUserProfile } from '../data/defaultSettings';

interface UserState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}

interface UserAction {
  type: 'SET_PROFILE' | 'UPDATE_PROFILE' | 'CLEAR_PROFILE' | 'SET_LOADING' | 'SET_ERROR';
  payload?: any;
}

const initialState: UserState = {
  profile: null,
  isLoading: false,
  error: null,
};

const UserContext = createContext<{
  state: UserState;
  dispatch: React.Dispatch<UserAction>;
} | null>(null);

function userReducer(state: UserState, action: UserAction): UserState {
  switch (action.type) {
    case 'SET_PROFILE':
      return {
        ...state,
        profile: action.payload,
        isLoading: false,
        error: null,
      };
    case 'UPDATE_PROFILE':
      return {
        ...state,
        profile: state.profile ? { ...state.profile, ...action.payload } : null,
      };
    case 'CLEAR_PROFILE':
      return {
        ...state,
        profile: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    default:
      return state;
  }
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(userReducer, initialState);

  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        dispatch({ type: 'SET_PROFILE', payload: profile });
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (state.profile) {
      localStorage.setItem('userProfile', JSON.stringify(state.profile));
    }
  }, [state.profile]);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}