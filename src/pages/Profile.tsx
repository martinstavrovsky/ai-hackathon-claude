import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { defaultUserProfile } from '../data/defaultSettings';
import { UserProfile } from '../types';

export default function Profile() {
  const { state, dispatch } = useUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    ...defaultUserProfile,
    ...state.profile,
  });

  const [limitationsText, setLimitationsText] = useState(
    state.profile?.limitations?.join(', ') || ''
  );

  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const steps = [
    'Personal Information',
    'Work Setup',
    'Fitness Level',
    'Preferences',
    'Work Schedule'
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedInputChange = (parentField: string, childField: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parentField]: {
        ...(prev[parentField as keyof UserProfile] as object || {}),
        [childField]: value,
      },
    }));
  };

  const handleArrayToggle = (field: string, value: string) => {
    setFormData(prev => {
      const currentArray = prev[field as keyof UserProfile] as string[] || [];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      
      return {
        ...prev,
        [field]: newArray,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const profile: UserProfile = {
        ...formData,
        id: state.profile?.id || `user-${Date.now()}`,
        name: formData.name || '',
        age: formData.age || 25,
        fitnessLevel: formData.fitnessLevel || 'beginner',
        limitations: formData.limitations || [],
        preferredExercises: formData.preferredExercises || [],
        workSetup: formData.workSetup || 'desk',
        workSchedule: formData.workSchedule || {
          startTime: '09:00',
          endTime: '17:00',
          lunchBreak: { start: '12:00', end: '13:00' },
        },
        workdayIntegration: formData.workdayIntegration || {
          enabled: false,
          employeeId: '',
          lastSync: new Date(),
          syncFrequency: 'daily',
        },
      };

      dispatch({ type: 'SET_PROFILE', payload: profile });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age
              </label>
              <input
                type="number"
                value={formData.age || ''}
                onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your age"
                min="18"
                max="100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Physical Limitations or Injuries
              </label>
              <textarea
                value={limitationsText}
                onChange={(e) => {
                  setLimitationsText(e.target.value);
                  const limitations = e.target.value ? e.target.value.split(',').map(s => s.trim()).filter(s => s.length > 0) : [];
                  handleInputChange('limitations', limitations);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., back pain, wrist injury (optional)"
                rows={3}
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Work Setup</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Work Setup
              </label>
              <div className="space-y-2">
                {['desk', 'standing', 'hybrid'].map(setup => (
                  <label key={setup} className="flex items-center">
                    <input
                      type="radio"
                      name="workSetup"
                      value={setup}
                      checked={formData.workSetup === setup}
                      onChange={(e) => handleInputChange('workSetup', e.target.value)}
                      className="mr-2"
                    />
                    <span className="capitalize">{setup} {setup === 'hybrid' ? 'Desk' : setup === 'desk' ? 'Job' : 'Desk'}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Fitness Level</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Fitness Level
              </label>
              <div className="space-y-2">
                {['beginner', 'intermediate', 'advanced'].map(level => (
                  <label key={level} className="flex items-center">
                    <input
                      type="radio"
                      name="fitnessLevel"
                      value={level}
                      checked={formData.fitnessLevel === level}
                      onChange={(e) => handleInputChange('fitnessLevel', e.target.value)}
                      className="mr-2"
                    />
                    <span className="capitalize">{level}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Exercise Preferences</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Exercise Types (select all that apply)
              </label>
              <div className="space-y-2">
                {['stretching', 'cardio', 'strength', 'breathing', 'eye care'].map(type => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.preferredExercises?.includes(type) || false}
                      onChange={() => handleArrayToggle('preferredExercises', type)}
                      className="mr-2"
                    />
                    <span className="capitalize">{type}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Work Schedule</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time
                </label>
                <input
                  type="time"
                  value={formData.workSchedule?.startTime || '09:00'}
                  onChange={(e) => handleNestedInputChange('workSchedule', 'startTime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time
                </label>
                <input
                  type="time"
                  value={formData.workSchedule?.endTime || '17:00'}
                  onChange={(e) => handleNestedInputChange('workSchedule', 'endTime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lunch Break
              </label>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="time"
                  value={formData.workSchedule?.lunchBreak?.start || '12:00'}
                  onChange={(e) => handleNestedInputChange('workSchedule', 'lunchBreak', {
                    ...formData.workSchedule?.lunchBreak,
                    start: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="time"
                  value={formData.workSchedule?.lunchBreak?.end || '13:00'}
                  onChange={(e) => handleNestedInputChange('workSchedule', 'lunchBreak', {
                    ...formData.workSchedule?.lunchBreak,
                    end: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">
              {state.profile ? 'Edit Profile' : 'Create Profile'}
            </h1>
            <span className="text-sm text-gray-500">
              {currentStep + 1} of {steps.length}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {renderStep()}

          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`px-4 py-2 rounded-lg font-medium ${
                currentStep === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              Previous
            </button>

            {currentStep === steps.length - 1 ? (
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save Profile'}
              </button>
            ) : (
              <button
                type="button"
                onClick={nextStep}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Next
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}