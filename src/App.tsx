import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import { BreakProvider } from './contexts/BreakContext';
import { ExerciseProvider } from './contexts/ExerciseContext';
import { WorkdayProvider } from './contexts/WorkdayContext';
import Welcome from './pages/Welcome';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import BreakSession from './pages/BreakSession';
import Settings from './pages/Settings';
import WorkdayIntegration from './pages/WorkdayIntegration';

function App() {
  return (
    <UserProvider>
      <BreakProvider>
        <ExerciseProvider>
          <WorkdayProvider>
            <Router>
              <div className="min-h-screen bg-gray-50">
                <Routes>
                  <Route path="/" element={<Welcome />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/break" element={<BreakSession />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/workday" element={<WorkdayIntegration />} />
                </Routes>
              </div>
            </Router>
          </WorkdayProvider>
        </ExerciseProvider>
      </BreakProvider>
    </UserProvider>
  );
}

export default App;