import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

/**
 * Custom hooks for Redux with TypeScript support
 * These pre-typed hooks provide type safety when using dispatch and selector
 */

// Use this instead of plain `useDispatch` for type safety
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Use this instead of plain `useSelector` for type safety with RootState
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
