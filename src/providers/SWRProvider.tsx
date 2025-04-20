"use client";

/**
 * Global SWR Provider
 * 
 * Configures SWR with optimal settings for the application
 * Following Next.js best practices for data fetching
 */

import { SWRConfig } from 'swr';
import { ReactNode } from 'react';
import { IS_DEVELOPMENT } from '../lib/config';

// Default fetcher for all SWR hooks
const defaultFetcher = async (url: string) => {
  const response = await fetch(url);
  
  // Handle HTTP errors
  if (!response.ok) {
    const error = new Error('An error occurred while fetching the data.');
    const data = await response.json().catch(() => null);
    
    // Enhance error with API response data
    (error as any).status = response.status;
    (error as any).info = data;
    throw error;
  }
  
  return response.json();
};

interface SWRProviderProps {
  children: ReactNode;
}

/**
 * Global SWR configuration provider
 * Configures caching, revalidation, and error handling
 */
export default function SWRProvider({ children }: SWRProviderProps) {
  return (
    <SWRConfig
      value={{
        fetcher: defaultFetcher,
        revalidateOnFocus: !IS_DEVELOPMENT, // Disable in development to prevent double fetching during hot reload
        revalidateOnReconnect: true,
        revalidateIfStale: true,
        shouldRetryOnError: true,
        dedupingInterval: 2000,
        errorRetryCount: 3,
        errorRetryInterval: 5000,
        suspense: false, // Set to true if using React Suspense
        onError: (error: Error, key: string) => {
          if (IS_DEVELOPMENT) {
            console.error(`SWR Error for ${key}:`, error);
          }
        }
      }}
    >
      {children}
    </SWRConfig>
  );
}
