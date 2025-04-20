'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Role } from '../../lib/auth/types';

interface AuthUser {
  id: number;
  username: string;
  role: string;
  name: string;
}

/**
 * Navigation component for the application
 * Contains the main navigation menu and branding
 * Shows different options based on authentication status and user role
 * @returns {JSX.Element} Navigation bar with links
 */
export default function Navigation() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Verificar token del cliente
    const checkAuth = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/auth/check');
        
        if (response.ok) {
          const data = await response.json();
          if (data.authenticated && data.user) {
            setIsLoggedIn(true);
            setIsAdmin(data.user.role === Role.ADMIN);
            setUser(data.user);
          } else {
            setIsLoggedIn(false);
            setIsAdmin(false);
            setUser(null);
          }
        } else {
          setIsLoggedIn(false);
          setIsAdmin(false);
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsLoggedIn(false);
        setIsAdmin(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setIsLoggedIn(false);
      setIsAdmin(false);
      setUser(null);
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="border-b border-gray-200 bg-white py-4 shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-6">
        <Link href="/" className="text-2xl font-serif text-emerald-800 font-medium">
          Solace
        </Link>
        
        <div className="flex items-center space-x-6">
          {isLoggedIn ? (
            <div className="relative">
              <button 
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center space-x-2 text-gray-700 hover:text-emerald-700 py-2 px-4 rounded-md border border-gray-300 hover:border-emerald-300"
              >
                <span>{user?.name || 'User'}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <div className="block px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                    {isAdmin ? 'Administrator' : 'Regular User'}
                  </div>
                  <button 
                    onClick={() => {
                      if (window.confirm('Are you sure you want to log out?')) {
                        handleLogout();
                      }
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="rounded-md bg-emerald-700 px-4 py-2 text-white hover:bg-emerald-800">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
