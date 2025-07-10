import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { WorkdaySchedule } from '../types';
import { MockWorkdayAPI } from '../services/workdayAPI';

interface WorkdayState {
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  schedule: WorkdaySchedule[];
  employeeId: string | null;
  lastSync: Date | null;
}

interface WorkdayAction {
  type: 'SET_LOADING' | 'SET_ERROR' | 'SET_CONNECTED' | 'SET_DISCONNECTED' | 'SET_SCHEDULE' | 'SET_SYNC';
  payload?: any;
}

const initialState: WorkdayState = {
  isConnected: false,
  isLoading: false,
  error: null,
  schedule: [],
  employeeId: null,
  lastSync: null,
};

const WorkdayContext = createContext<{
  state: WorkdayState;
  dispatch: React.Dispatch<WorkdayAction>;
  connect: (username: string, password: string) => Promise<boolean>;
  disconnect: () => void;
  syncSchedule: (dateRange: { start: string; end: string }) => Promise<void>;
} | null>(null);

function workdayReducer(state: WorkdayState, action: WorkdayAction): WorkdayState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_CONNECTED':
      return {
        ...state,
        isConnected: true,
        employeeId: action.payload,
        error: null,
        isLoading: false,
      };
    case 'SET_DISCONNECTED':
      return {
        ...state,
        isConnected: false,
        employeeId: null,
        schedule: [],
        lastSync: null,
      };
    case 'SET_SCHEDULE':
      return { ...state, schedule: action.payload };
    case 'SET_SYNC':
      return { ...state, lastSync: action.payload };
    default:
      return state;
  }
}

export function WorkdayProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(workdayReducer, initialState);
  const workdayAPI = MockWorkdayAPI.getInstance();

  const connect = async (username: string, password: string): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const response = await workdayAPI.authenticate({ username, password });
      
      if (response.success && response.employeeId) {
        dispatch({ type: 'SET_CONNECTED', payload: response.employeeId });
        return true;
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.error || 'Authentication failed' });
        return false;
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Connection failed' });
      return false;
    }
  };

  const disconnect = () => {
    workdayAPI.logout();
    dispatch({ type: 'SET_DISCONNECTED' });
  };

  const syncSchedule = async (dateRange: { start: string; end: string }) => {
    if (!state.employeeId) {
      dispatch({ type: 'SET_ERROR', payload: 'Not connected to Workday' });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const schedule = await workdayAPI.getSchedule(state.employeeId, dateRange);
      dispatch({ type: 'SET_SCHEDULE', payload: schedule });
      dispatch({ type: 'SET_SYNC', payload: new Date() });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to sync schedule' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return (
    <WorkdayContext.Provider value={{ state, dispatch, connect, disconnect, syncSchedule }}>
      {children}
    </WorkdayContext.Provider>
  );
}

export function useWorkday() {
  const context = useContext(WorkdayContext);
  if (!context) {
    throw new Error('useWorkday must be used within a WorkdayProvider');
  }
  return context;
}