"use client";

/**
 * Advocate data fetching hooks
 * 
 * Uses SWR for efficient data fetching following Next.js best practices
 * https://swr.vercel.app/
 */

import useSWR from 'swr';
import { Advocate, AdvocateQueryResult } from '../../types/advocates';
import { PaginationParams } from '../../types/common/pagination';
import { API_CONFIG } from '../config';

// Fetch function for data fetching
const fetcher = (url: string) => fetch(url).then(res => {
  if (!res.ok) throw new Error('Failed to fetch advocates');
  return res.json();
});

/**
 * Hook for fetching advocates with filtering and pagination
 * 
 * @param params Pagination and filter parameters
 * @returns Response with advocates data and pagination
 */
export function useAdvocates(params: Partial<PaginationParams> = { page: 1, limit: 10 }) {
  // Default values
  const page = params.page || 1;
  const limit = params.limit || API_CONFIG.defaultPageSize;
  
  // Build query string
  const queryParams = new URLSearchParams();
  queryParams.append('page', page.toString());
  queryParams.append('limit', limit.toString());
  
  if (params.search) queryParams.append('search', params.search);
  if (params.specialty) queryParams.append('specialty', params.specialty);
  if (params.city) queryParams.append('city', params.city);
  
  // Fetch data with SWR
  const { data, error, mutate, isLoading } = useSWR<AdvocateQueryResult>(
    `/api/advocates?${queryParams.toString()}`,
    fetcher
  );
  
  return {
    advocates: data?.data || [],
    pagination: data?.pagination || { page, limit, total: 0, totalPages: 0 },
    isLoading,
    isError: !!error,
    error,
    mutate
  };
}

/**
 * Hook for fetching a single advocate by ID
 * 
 * @param id Advocate ID
 * @returns Response with advocate data
 */
export function useAdvocate(id?: number) {
  // Fetch data with SWR
  const { data, error, mutate, isLoading } = useSWR<Advocate>(
    id ? `/api/advocates/${id}` : null,
    fetcher
  );
  
  return {
    advocate: data,
    isLoading,
    isError: !!error,
    error,
    mutate
  };
}
