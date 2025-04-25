import { Advocate } from '../types/advocates';
import { PaginationInfo } from '../types/common/pagination';
import { Role } from '../lib/auth/types';

// Auth State Types
export interface AuthUser {
  id: number;
  username: string;
  role: Role;
}

export interface AuthState {
  user: AuthUser | null;
  authenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Advocates State Types
export interface AdvocatesFilterParams {
  search: string;
  specialty: string;
  city: string;
}

export interface AdvocatesState {
  advocates: Advocate[];
  pagination: PaginationInfo;
  filterParams: AdvocatesFilterParams;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// UI State Types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  autoClose?: boolean;
  duration?: number;
}

export interface ModalState {
  isOpen: boolean;
  type: string | null;
  data?: any;
}

export interface UiState {
  notifications: Notification[];
  modal: ModalState;
  loading: {
    global: boolean;
    [key: string]: boolean;
  };
}

// Root State Type
export interface RootState {
  auth: AuthState;
  advocates: AdvocatesState;
  ui: UiState;
}
