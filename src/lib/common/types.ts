/**
 * Common types and interfaces used across the application
 * @module lib/common/types
 */

/**
 * Pagination metadata information
 * @interface PaginationInfo
 * @property {number} total - Total number of items across all pages
 * @property {number} page - Current page number
 * @property {number} limit - Number of items per page
 * @property {number} totalPages - Total number of available pages
 */
export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Parameters for pagination and filtering
 * @interface PaginationParams
 * @property {number} page - Current page number (1-based)
 * @property {number} limit - Number of items per page
 * @property {string} [search] - Optional search term
 * @property {Record<string, string>} [filters] - Optional key-value filters
 */
export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  filters?: Record<string, string>;
}

/**
 * Generic query result with pagination
 * @interface PaginatedResult<T>
 * @property {T[]} data - Array of data items
 * @property {PaginationInfo} pagination - Pagination metadata
 * @property {boolean} [isStaticData] - Whether data is from static source
 */
export interface PaginatedResult<T> {
  data: T[];
  pagination: PaginationInfo;
  isStaticData?: boolean;
}
