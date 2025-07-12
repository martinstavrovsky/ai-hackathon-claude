import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBreak } from '../contexts/BreakContext';
import { useUser } from '../contexts/UserContext';
import { useExercise } from '../contexts/ExerciseContext';
import { getRecommendedExercises } from '../utils/exerciseRecommendations';
import { Exercise } from '../types';

export default function BreakSession() {
  const navigate = useNavigate();
  const { state: breakState, dispatch: breakDispatch } = useBreak();
  const { state: userState } = useUser();
  const { state: exerciseState, dispatch: exerciseDispatch } = useExercise();
  
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [exerciseTimer, setExerciseTimer] = useState(0);
  const [sessionTimer, setSessionTimer] = useState(0);
  const [isExerciseActive, setIsExerciseActive] = useState(false);
  const [sessionExercises, setSessionExercises] = useState<Exercise[]>([]);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  const [sessionStarted, setSessionStarted] = useState(false);

  useEffect(() => {
    if (!userState.profile) {
      navigate('/profile');
      return;
    }

    if (!breakState.currentSession) {
      const now = new Date();
      const timeOfDay = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
      const recentExercises = breakState.breakHistory
        .slice(-10)
        .flatMap(session => session.completedExercises || []);

      const recommendedExercises = getRecommendedExercises(
        exerciseState.exercises,
        {
          userProfile: userState.profile,
          breakSettings: breakState.settings,
          timeOfDay,
          completedExercises: recentExercises,
          preferredCategories: userState.profile.preferredExercises
        },
        3
      );

      setSessionExercises(recommendedExercises);
      
      const newSession = {
        id: `break-${Date.now()}`,
        startTime: new Date(),
        exercises: recommendedExercises,
        completedExercises: [],
        skipped: false
      };

      breakDispatch({ type: 'START_BREAK', payload: newSession });
    } else {
      setSessionExercises(breakState.currentSession.exercises);
      setCompletedExercises(breakState.currentSession.completedExercises || []);
    }
  }, [userState.profile, breakState.currentSession, exerciseState.exercises, breakState.settings, breakState.breakHistory, breakDispatch, navigate]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (sessionStarted) {
      interval = setInterval(() => {
        setSessionTimer(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [sessionStarted]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isExerciseActive && exerciseTimer > 0) {
      interval = setInterval(() => {
        setExerciseTimer(prev => {
          if (prev <= 1) {
            setIsExerciseActive(false);
            completeCurrentExercise();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isExerciseActive, exerciseTimer]);

  const startSession = () => {
    setSessionStarted(true);
    if (sessionExercises.length > 0) {
      startCurrentExercise();
    }
  };

  const startCurrentExercise = () => {
    const currentExercise = sessionExercises[currentExerciseIndex];
    if (currentExercise) {
      setExerciseTimer(currentExercise.duration);
      setIsExerciseActive(true);
    }
  };

  const completeCurrentExercise = () => {
    const currentExercise = sessionExercises[currentExerciseIndex];
    if (currentExercise) {
      const newCompleted = [...completedExercises, currentExercise.id];
      setCompletedExercises(newCompleted);
      
      exerciseDispatch({
        type: 'RECORD_COMPLETION',
        payload: {
          exerciseId: currentExercise.id,
          completedAt: new Date(),
          liked: true
        }
      });

      breakDispatch({
        type: 'UPDATE_SESSION',
        payload: { completedExercises: newCompleted }
      });
    }

    if (currentExerciseIndex < sessionExercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    } else {
      endSession();
    }
  };

  const skipCurrentExercise = () => {
    setIsExerciseActive(false);
    setExerciseTimer(0);
    
    if (currentExerciseIndex < sessionExercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    } else {
      endSession();
    }
  };

  const endSession = () => {
    breakDispatch({ type: 'END_BREAK' });
    
    const nextBreak = new Date();
    nextBreak.setMinutes(nextBreak.getMinutes() + breakState.settings.frequency);
    breakDispatch({ type: 'SET_NEXT_BREAK', payload: nextBreak });
    
    navigate('/dashboard');
  };

  const skipEntireSession = () => {
    breakDispatch({
      type: 'UPDATE_SESSION',
      payload: { skipped: true }
    });
    breakDispatch({ type: 'END_BREAK' });
    navigate('/dashboard');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentExercise = sessionExercises[currentExerciseIndex];
  const progress = Math.round(((currentExerciseIndex + (isExerciseActive ? 1 : 0)) / sessionExercises.length) * 100);

  if (!userState.profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      breakState.settings.enableScreenLock ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className={`max-w-2xl w-full rounded-lg shadow-lg p-8 ${
        breakState.settings.enableScreenLock ? 'bg-gray-800 text-white' : 'bg-white'
      }`}>
        {!sessionStarted ? (
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Break Time!</h1>
            <p className="text-lg mb-6">
              Ready for a {breakState.settings.duration}-minute break with {sessionExercises.length} exercises?
            </p>
            
            <div className="space-y-4 mb-8">
              {sessionExercises.map((exercise, index) => (
                <div key={exercise.id} className={`p-4 border rounded-lg ${
                  breakState.settings.enableScreenLock ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
                }`}>
                  <h3 className="font-semibold">{exercise.name}</h3>
                  <p className="text-sm opacity-80">{exercise.description}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
                      {exercise.duration}s
                    </span>
                    <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">
                      {exercise.difficulty}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={startSession}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-semibold text-lg"
              >
                Start Break
              </button>
              <button
                onClick={skipEntireSession}
                className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 font-semibold text-lg"
              >
                Skip Break
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Break Session</h1>
              <div className="text-right">
                <div className="text-sm opacity-80">Session Time</div>
                <div className="text-lg font-semibold">{formatTime(sessionTimer)}</div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Progress</span>
                <span className="text-sm">{currentExerciseIndex + 1} of {sessionExercises.length}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {currentExercise && (
              <div className="mb-8">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold mb-2">{currentExercise.name}</h2>
                  <p className="text-lg opacity-80 mb-4">{currentExercise.description}</p>
                  
                  {isExerciseActive && (
                    <div className="text-6xl font-bold text-blue-600 mb-4">
                      {formatTime(exerciseTimer)}
                    </div>
                  )}
                </div>

                <div className={`p-6 rounded-lg border ${
                  breakState.settings.enableScreenLock ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
                }`}>
                  <h3 className="font-semibold mb-3">Instructions:</h3>
                  <ol className="space-y-2">
                    {currentExercise.instructions.map((instruction, index) => (
                      <li key={index} className="flex items-start">
                        <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mr-2 mt-0.5">
                          {index + 1}
                        </span>
                        <span>{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="flex justify-center space-x-4 mt-6">
                  {!isExerciseActive ? (
                    <button
                      onClick={startCurrentExercise}
                      className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold"
                    >
                      Start Exercise
                    </button>
                  ) : (
                    <button
                      onClick={completeCurrentExercise}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
                    >
                      Complete Exercise
                    </button>
                  )}
                  
                  <button
                    onClick={skipCurrentExercise}
                    className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 font-semibold"
                  >
                    Skip Exercise
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center">
              <button
                onClick={endSession}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                End Break
              </button>
              
              <div className="text-sm opacity-80">
                Completed: {completedExercises.length} / {sessionExercises.length}
              </div>
            </div>
          </div>
        )}
      </div>

      {breakState.settings.enableScreenLock && (
        <div className="fixed bottom-4 right-4 text-white text-sm opacity-60">
          Press ESC to exit
        </div>
      )}
    </div>
  );
}