'use client';

import { Provider } from 'react-redux';
import { store } from '../redux/store';
import { ReactNode, useEffect } from 'react';
import { checkAuth } from '../redux/slices/auth';
import { useAppDispatch } from '../redux/hooks';

/**
 * Internal component to handle initial authentication check
 */
function AuthInitializer({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  
  // Check authentication status when app loads
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);
  
  return <>{children}</>;
}

/**
 * Redux Provider for the application
 * Wraps the entire app to provide Redux state management
 */
export default function ReduxProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <AuthInitializer>
        {children}
      </AuthInitializer>
    </Provider>
  );
}
