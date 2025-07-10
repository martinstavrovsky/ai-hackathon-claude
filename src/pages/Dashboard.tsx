import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useBreak } from '../contexts/BreakContext';
import { useExercise } from '../contexts/ExerciseContext';
import { getRecommendedExercises } from '../utils/exerciseRecommendations';

export default function Dashboard() {
  const { state: userState } = useUser();
  const { state: breakState, dispatch: breakDispatch } = useBreak();
  const { state: exerciseState } = useExercise();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (userState.profile && !breakState.nextBreakTime) {
      const nextBreak = new Date();
      nextBreak.setMinutes(nextBreak.getMinutes() + breakState.settings.frequency);
      breakDispatch({ type: 'SET_NEXT_BREAK', payload: nextBreak });
    }
  }, [userState.profile, breakState.settings.frequency, breakState.nextBreakTime, breakDispatch]);

  const getTimeUntilNextBreak = () => {
    if (!breakState.nextBreakTime) return null;
    
    const diff = breakState.nextBreakTime.getTime() - currentTime.getTime();
    if (diff <= 0) return 'Break time!';
    
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const getTodaysProgress = () => {
    const today = new Date().toDateString();
    const todaysBreaks = breakState.breakHistory.filter(
      session => session.startTime && new Date(session.startTime).toDateString() === today
    );
    
    const completedExercises = todaysBreaks.reduce((acc, session) => {
      return acc + (session.completedExercises?.length || 0);
    }, 0);

    return {
      breaks: todaysBreaks.length,
      exercises: completedExercises,
      totalTime: todaysBreaks.reduce((acc, session) => {
        if (session.startTime && session.endTime) {
          return acc + (new Date(session.endTime).getTime() - new Date(session.startTime).getTime());
        }
        return acc;
      }, 0)
    };
  };

  const getRecommendedExercisesForUser = () => {
    if (!userState.profile) return [];
    
    const now = new Date();
    const timeOfDay = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const recentExercises = breakState.breakHistory
      .slice(-5)
      .flatMap(session => session.completedExercises || []);

    return getRecommendedExercises(
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
  };

  const startQuickBreak = () => {
    const exercises = getRecommendedExercisesForUser();
    const breakSession = {
      id: `break-${Date.now()}`,
      startTime: new Date(),
      exercises: exercises.slice(0, 2),
      completedExercises: [],
      skipped: false
    };

    breakDispatch({ type: 'START_BREAK', payload: breakSession });
  };

  const progress = getTodaysProgress();
  const timeUntilBreak = getTimeUntilNextBreak();
  const recommendedExercises = getRecommendedExercisesForUser();

  if (!userState.profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Welcome!</h1>
          <p className="text-gray-600 mb-6">Please set up your profile to get started</p>
          <Link 
            to="/profile" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
          >
            Create Profile
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">
              Good {currentTime.getHours() < 12 ? 'Morning' : currentTime.getHours() < 17 ? 'Afternoon' : 'Evening'}, {userState.profile.name}!
            </h1>
            <div className="flex space-x-2">
              <Link 
                to="/workday" 
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
              >
                Workday
              </Link>
              <Link 
                to="/settings" 
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                Settings
              </Link>
              <Link 
                to="/profile" 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Edit Profile
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">Today's Breaks</h3>
              <p className="text-2xl font-bold text-green-600">{progress.breaks}</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Exercises Completed</h3>
              <p className="text-2xl font-bold text-blue-600">{progress.exercises}</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-purple-800 mb-2">Total Break Time</h3>
              <p className="text-2xl font-bold text-purple-600">
                {Math.round(progress.totalTime / 60000)}m
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-yellow-800 mb-1">Next Break</h3>
                <p className="text-yellow-700">
                  {timeUntilBreak === 'Break time!' ? 'It\'s time for a break!' : `In ${timeUntilBreak}`}
                </p>
              </div>
              <div className="space-x-2">
                {timeUntilBreak === 'Break time!' && (
                  <Link 
                    to="/break"
                    className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700"
                  >
                    Take Break
                  </Link>
                )}
                <button
                  onClick={startQuickBreak}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Quick Break
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Recommended Exercises</h3>
              <div className="space-y-2">
                {recommendedExercises.map(exercise => (
                  <div key={exercise.id} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-800">{exercise.name}</h4>
                        <p className="text-sm text-gray-600">{exercise.description}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                            {exercise.duration}s
                          </span>
                          <span className="text-xs bg-blue-200 px-2 py-1 rounded">
                            {exercise.category}
                          </span>
                          <span className="text-xs bg-green-200 px-2 py-1 rounded">
                            {exercise.difficulty}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Recent Activity</h3>
              <div className="space-y-2">
                {breakState.breakHistory.slice(-5).reverse().map(session => (
                  <div key={session.id} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-800">
                          {session.skipped ? 'Break Skipped' : 'Break Completed'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {session.startTime && new Date(session.startTime).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          {session.completedExercises?.length || 0} exercises completed
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs px-2 py-1 rounded ${
                          session.skipped ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'
                        }`}>
                          {session.skipped ? 'Skipped' : 'Completed'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {breakState.breakHistory.length === 0 && (
                  <div className="text-gray-500 text-center py-4">
                    No breaks taken yet. Start your first break!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}