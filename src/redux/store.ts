import { configureStore } from '@reduxjs/toolkit';
import advocatesReducer from './slices/advocates';
import authReducer from './slices/auth';
import uiReducer from './slices/ui';
import { RootState } from './types';

/**
 * Configure and export the Redux store
 * This is the central state management for the application
 */
export const store = configureStore({
  reducer: {
    advocates: advocatesReducer,
    auth: authReducer,
    ui: uiReducer
  },
  // Enable Redux DevTools in development environment
  devTools: process.env.NODE_ENV !== 'production',
});

// Re-export the RootState type for use throughout the app
export type { RootState };

// Export the App-specific dispatch type
export type AppDispatch = typeof store.dispatch;
