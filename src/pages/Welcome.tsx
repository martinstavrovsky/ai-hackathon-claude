import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

export default function Welcome() {
  const { state } = useUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Workday Break App
          </h1>
          <p className="text-gray-600">
            Take structured breaks with personalized exercises to boost your productivity and well-being
          </p>
        </div>

        <div className="space-y-4">
          {state.profile ? (
            <>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-green-800">
                  Welcome back, {state.profile.name}!
                </p>
              </div>
              <Link
                to="/dashboard"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium inline-block"
              >
                Go to Dashboard
              </Link>
              <Link
                to="/profile"
                className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors font-medium inline-block"
              >
                Edit Profile
              </Link>
            </>
          ) : (
            <>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-yellow-800">
                  Let's set up your profile to get started with personalized breaks
                </p>
              </div>
              <Link
                to="/profile"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium inline-block"
              >
                Create Profile
              </Link>
            </>
          )}

          <div className="mt-8 text-sm text-gray-500">
            <p>Features:</p>
            <ul className="mt-2 space-y-1">
              <li>• Personalized exercise recommendations</li>
              <li>• Smart break scheduling</li>
              <li>• Progress tracking & analytics</li>
              <li>• Workday integration</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}