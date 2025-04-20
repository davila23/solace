/**
 * Common pagination types used across the application
 */

/**
 * Parameters for pagination and filtering
 * @interface PaginationParams
 * @property {number} page - Current page number (1-based)
 * @property {number} limit - Number of items per page
 * @property {string} [search] - Optional search term for name filtering
 * @property {string} [specialty] - Optional specialty filter used for advocates
 * @property {string} [city] - Optional city filter used for advocates
 * @property {string} [sortBy] - Field to sort results by (e.g., 'lastName', 'city')
 * @property {"asc" | "desc"} [sortOrder] - Sort direction (ascending or descending)
 */
export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  specialty?: string;
  city?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

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
 * Generic paginated result structure
 * @interface PaginatedResult
 * @property {T[]} data - Array of data items
 * @property {PaginationInfo} pagination - Pagination metadata
 */
export interface PaginatedResult<T> {
  data: T[];
  pagination: PaginationInfo;
}
