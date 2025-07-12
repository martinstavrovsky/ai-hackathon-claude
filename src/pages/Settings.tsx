import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBreak } from '../contexts/BreakContext';
import { useUser } from '../contexts/UserContext';

export default function Settings() {
  const { state: breakState, dispatch: breakDispatch } = useBreak();
  const { state: userState } = useUser();
  const [settings, setSettings] = useState(breakState.settings);

  const handleSettingChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    breakDispatch({ type: 'UPDATE_SETTINGS', payload: settings });
    alert('Settings saved successfully!');
  };

  const handleReset = () => {
    setSettings(breakState.settings);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
            <Link 
              to="/dashboard"
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              Back to Dashboard
            </Link>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Break Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Break Frequency (minutes)
                  </label>
                  <select
                    value={settings.frequency}
                    onChange={(e) => handleSettingChange('frequency', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={90}>1.5 hours</option>
                    <option value={120}>2 hours</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Break Duration (minutes)
                  </label>
                  <select
                    value={settings.duration}
                    onChange={(e) => handleSettingChange('duration', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={2}>2 minutes</option>
                    <option value={5}>5 minutes</option>
                    <option value={10}>10 minutes</option>
                    <option value={15}>15 minutes</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="autoStart"
                    checked={settings.autoStart}
                    onChange={(e) => handleSettingChange('autoStart', e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="autoStart" className="text-sm text-gray-700">
                    Auto-start breaks
                  </label>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Notification Settings</h2>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enableNotifications"
                    checked={settings.enableNotifications}
                    onChange={(e) => handleSettingChange('enableNotifications', e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="enableNotifications" className="text-sm text-gray-700">
                    Enable browser notifications
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="soundEnabled"
                    checked={settings.soundEnabled}
                    onChange={(e) => handleSettingChange('soundEnabled', e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="soundEnabled" className="text-sm text-gray-700">
                    Enable sound notifications
                  </label>
                </div>

                {settings.soundEnabled && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Volume ({Math.round(settings.volume * 100)}%)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={settings.volume}
                      onChange={(e) => handleSettingChange('volume', parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Screen Lock Settings</h2>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enableScreenLock"
                    checked={settings.enableScreenLock}
                    onChange={(e) => handleSettingChange('enableScreenLock', e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="enableScreenLock" className="text-sm text-gray-700">
                    Enable screen lock during breaks
                  </label>
                </div>

                {settings.enableScreenLock && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">
                      Screen lock will create a fullscreen overlay during breaks to minimize distractions.
                      You can still exit by pressing the escape key.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Data Management</h2>
              
              <div className="space-y-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-800 mb-2">Storage Information</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    All your data is stored locally in your browser. No data is sent to external servers.
                  </p>
                  <div className="text-sm text-gray-500">
                    <p>• Profile: {userState.profile ? 'Created' : 'Not set'}</p>
                    <p>• Break History: {breakState.breakHistory.length} sessions</p>
                    <p>• Settings: Configured</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
                      localStorage.clear();
                      window.location.reload();
                    }
                  }}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Clear All Data
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-8">
            <button
              onClick={handleReset}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
            >
              Reset Changes
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}