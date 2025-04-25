import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UiState, Notification, ModalState } from '../types';

// Use the UiState, Notification, and ModalState types from types.ts

// Initial state values
const initialState: UiState = {
  notifications: [],
  modal: {
    isOpen: false,
    type: null,
    data: null
  },
  loading: {
    global: false
  }
};

// Create the UI slice with reducers and actions
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Add a notification to the queue
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id'>>) => {
      const id = Date.now().toString();
      state.notifications.push({
        ...action.payload,
        id,
        autoClose: action.payload.autoClose !== false // Default to true
      });
    },
    
    // Remove a notification by ID
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    
    // Clear all notifications
    clearNotifications: (state) => {
      state.notifications = [];
    },
    
    // Open a modal with optional data
    openModal: (state, action: PayloadAction<{ type: string; data?: any }>) => {
      state.modal = {
        isOpen: true,
        type: action.payload.type,
        data: action.payload.data || null
      };
    },
    
    // Close the currently open modal
    closeModal: (state) => {
      state.modal = {
        isOpen: false,
        type: null,
        data: null
      };
    },
    
    // Set loading state for a specific key
    setLoading: (state, action: PayloadAction<{ key: string; isLoading: boolean }>) => {
      state.loading[action.payload.key] = action.payload.isLoading;
    },
    
    // Set global loading state
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.global = action.payload;
    }
  }
});

// Export actions and reducer
export const {
  addNotification,
  removeNotification,
  clearNotifications,
  openModal,
  closeModal,
  setLoading,
  setGlobalLoading
} = uiSlice.actions;

export default uiSlice.reducer;
