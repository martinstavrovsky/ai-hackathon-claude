import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWorkday } from '../contexts/WorkdayContext';

export default function WorkdayIntegration() {
  const { state, connect, disconnect, syncSchedule } = useWorkday();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [syncDateRange, setSyncDateRange] = useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  useEffect(() => {
    if (state.isConnected && state.employeeId) {
      syncSchedule(syncDateRange);
    }
  }, [state.isConnected, state.employeeId]);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await connect(credentials.username, credentials.password);
    if (success) {
      setCredentials({ username: '', password: '' });
    }
  };

  const handleSync = async () => {
    await syncSchedule(syncDateRange);
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getMeetingTypeColor = (type: string) => {
    switch (type) {
      case 'meeting':
        return 'bg-blue-100 text-blue-800';
      case 'focus-time':
        return 'bg-green-100 text-green-800';
      case 'lunch':
        return 'bg-orange-100 text-orange-800';
      case 'break':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Workday Integration</h1>
            <Link 
              to="/dashboard"
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              Back to Dashboard
            </Link>
          </div>

          {!state.isConnected ? (
            <div className="mb-8">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h2 className="text-lg font-semibold text-blue-800 mb-2">Connect to Workday</h2>
                <p className="text-blue-700 mb-4">
                  Connect your Workday account to automatically sync your schedule and optimize break timing.
                </p>
                <p className="text-sm text-blue-600">
                  <strong>Demo credentials:</strong> Username: demo, Password: demo
                </p>
              </div>

              <form onSubmit={handleConnect} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={credentials.username}
                    onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your Workday username"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={credentials.password}
                    onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your Workday password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={state.isLoading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {state.isLoading ? 'Connecting...' : 'Connect to Workday'}
                </button>
              </form>

              {state.error && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800">{state.error}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold text-green-800">Connected to Workday</h2>
                    <p className="text-green-700">
                      Employee ID: {state.employeeId}
                    </p>
                    {state.lastSync && (
                      <p className="text-sm text-green-600">
                        Last sync: {state.lastSync.toLocaleString()}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={disconnect}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                  >
                    Disconnect
                  </button>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Schedule Sync</h3>
                  <button
                    onClick={handleSync}
                    disabled={state.isLoading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {state.isLoading ? 'Syncing...' : 'Sync Schedule'}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={syncDateRange.start}
                      onChange={(e) => setSyncDateRange(prev => ({ ...prev, start: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={syncDateRange.end}
                      onChange={(e) => setSyncDateRange(prev => ({ ...prev, end: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {state.schedule.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Schedule</h3>
                  <div className="space-y-4">
                    {state.schedule.map((daySchedule) => (
                      <div key={daySchedule.date} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-semibold text-gray-800">
                            {new Date(daySchedule.date + 'T00:00:00').toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </h4>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              daySchedule.workload === 'heavy' ? 'bg-red-100 text-red-800' :
                              daySchedule.workload === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {daySchedule.workload} workload
                            </span>
                            <span className="text-sm text-gray-600">
                              {formatTime(daySchedule.workingHours.start)} - {formatTime(daySchedule.workingHours.end)}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {daySchedule.meetings.map((meeting) => (
                            <div key={meeting.id} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                              <div className="text-sm">
                                <div className="font-medium">{meeting.title}</div>
                                <div className="text-gray-600">
                                  {formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}
                                </div>
                              </div>
                              <div className="ml-auto">
                                <span className={`px-2 py-1 rounded-full text-xs ${getMeetingTypeColor(meeting.type)}`}>
                                  {meeting.type}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Integration Benefits</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Automatic break scheduling around meetings
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Intelligent workload analysis for break timing
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                No breaks during focus time or important meetings
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Adaptive break intensity based on schedule density
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Respect PTO and time-off periods
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}