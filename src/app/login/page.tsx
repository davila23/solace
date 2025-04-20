'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Login page component
 * Allows users to authenticate to the system
 */
export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  /**
   * Handle form submission
   * Attempts to authenticate user with provided credentials
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Enviando solicitud de login para:', username);
      
      // Agregamos un timeout para asegurarnos de que la solicitud se complete
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos timeout
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      console.log('Respuesta recibida:', response.status);
      const data = await response.json();
      console.log('Datos recibidos:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      console.log('Login exitoso, redirigiendo...');
      // Pequeño retraso para asegurar que la cookie se establezca correctamente
      setTimeout(() => {
        router.push('/advocates');
        router.refresh();
      }, 500);
    } catch (err: any) {
      console.error('Error durante el login:', err);
      setError(err.message || 'Error de conexión. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif text-emerald-800 font-medium">Solace</h2>
          <p className="mt-2 text-gray-600">Sign in to access the Advocates platform</p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
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
