'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Redux imports
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { loginUser, clearError } from '../../redux/slices/auth';

/**
 * Login page component
 * Allows users to authenticate to the system
 */
export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  // Get auth state from Redux
  const { loading, error, authenticated } = useAppSelector(state => state.auth);

  /**
   * Redirect to advocates page if already authenticated
   */
  useEffect(() => {
    if (authenticated) {
      router.push('/advocates');
    }
    
    // Clear any previous auth errors when component mounts
    dispatch(clearError());
  }, [authenticated, router, dispatch]);

  /**
   * Handle form submission
   * Attempts to authenticate user with provided credentials using Redux
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    
    try {
      // Dispatch Redux action to log in user
      const resultAction = await dispatch(loginUser({ username, password })).unwrap();
      
      // If login is successful, redirect to advocates page
      if (resultAction && resultAction.user) {
        router.push('/advocates');
        router.refresh();
      }
    } catch (err: any) {
      console.error('Error during login:', err);
      setLocalError(err.message || 'Connection error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif text-emerald-800 font-medium">Solace</h2>
          <p className="mt-2 text-gray-600">Sign in to access the Advocates platform</p>
        </div>
        
        {(localError || error) && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {localError || error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
              disabled={loading}
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
              disabled={loading}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-emerald-300"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            <strong>Demo Accounts:</strong>
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Admin: username=admin, password=admin123
          </p>
          <p className="text-sm text-gray-600">
            Test User: username=user, password=user123
          </p>
        </div>
      </div>
    </div>
  );
}
