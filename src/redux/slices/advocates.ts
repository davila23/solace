import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Advocate } from '../../types/advocates';
import { AdvocatesState, AdvocatesFilterParams } from '../types';

// Use the AdvocatesState type from types.ts

// Initial state values
const initialState: AdvocatesState = {
  advocates: [],
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  },
  filterParams: {
    search: '',
    specialty: '',
    city: ''
  },
  status: 'idle',
  error: null
};

/**
 * Async thunk to fetch advocates from the API
 * Supports pagination and filtering options
 */
export const fetchAdvocates = createAsyncThunk(
  'advocates/fetchAdvocates',
  async ({ page = 1, limit = 10, filters = {} }: {
    page?: number;
    limit?: number;
    filters?: Partial<AdvocatesFilterParams>
  }, { rejectWithValue }) => {
    try {
      // Build query parameters
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      
      if (filters.search) params.append('search', filters.search);
      if (filters.specialty) params.append('specialty', filters.specialty);
      if (filters.city) params.append('city', filters.city);
      
      // Request data from the API
      const response = await fetch(`/api/advocates?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch advocates');
      }
      
      return await response.json();
    } catch (error) {
      // Handle errors and pass to the rejected case
      return rejectWithValue(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  }
);

/**
 * Async thunk to delete an advocate by ID
 */
export const deleteAdvocate = createAsyncThunk(
  'advocates/deleteAdvocate',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/advocates/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete advocate');
      }
      
      return id; // Return the ID to remove from state
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  }
);

/**
 * Async thunk to create a new advocate
 */
export const createAdvocate = createAsyncThunk(
  'advocates/createAdvocate',
  async (advocateData: Omit<Advocate, 'id'>, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/advocates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(advocateData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create advocate');
      }
      
      return await response.json();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  }
);

/**
 * Async thunk to update an existing advocate
 */
export const updateAdvocate = createAsyncThunk(
  'advocates/updateAdvocate',
  async ({ id, ...advocateData }: Advocate, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/advocates/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(advocateData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update advocate');
      }
      
      return await response.json();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  }
);

// Create the advocates slice with reducers and actions
const advocatesSlice = createSlice({
  name: 'advocates',
  initialState,
  reducers: {
    // Action to update filter parameters
    setFilterParams: (state, action: PayloadAction<AdvocatesFilterParams>) => {
      state.filterParams = action.payload;
    },
    // Action to reset all filters
    resetFilters: (state) => {
      state.filterParams = initialState.filterParams;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchAdvocates states
      .addCase(fetchAdvocates.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAdvocates.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.advocates = action.payload.data || [];
        state.pagination = action.payload.pagination || initialState.pagination;
        state.error = null;
      })
      .addCase(fetchAdvocates.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Handle deleteAdvocate states
      .addCase(deleteAdvocate.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteAdvocate.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Remove the deleted advocate from the state
        state.advocates = state.advocates.filter(advocate => advocate.id !== action.payload);
        // Update pagination counts
        state.pagination.total = Math.max(0, state.pagination.total - 1);
        state.pagination.totalPages = Math.ceil(state.pagination.total / state.pagination.limit);
        state.error = null;
      })
      .addCase(deleteAdvocate.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Handle createAdvocate states
      .addCase(createAdvocate.fulfilled, (state, action) => {
        // Optionally add to the list if on first page
        if (state.pagination.page === 1) {
          state.advocates.unshift(action.payload);
          // Remove last item if limit exceeded
          if (state.advocates.length > state.pagination.limit) {
            state.advocates.pop();
          }
        }
        // Update pagination counts
        state.pagination.total += 1;
        state.pagination.totalPages = Math.ceil(state.pagination.total / state.pagination.limit);
      })
      
      // Handle updateAdvocate states
      .addCase(updateAdvocate.fulfilled, (state, action) => {
        // Update the advocate in the state if it exists
        const index = state.advocates.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.advocates[index] = action.payload;
        }
      });
  }
});

// Export actions and reducer
export const { setFilterParams, resetFilters } = advocatesSlice.actions;
export default advocatesSlice.reducer;
