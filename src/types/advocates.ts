import { PaginationInfo, PaginatedResult } from './common/pagination';

/**
 * Advocate interface for representing healthcare advocate professionals
 * @interface Advocate
 * @property {number} id - Unique identifier
 * @property {string} firstName - First name of the advocate
 * @property {string} lastName - Last name of the advocate
 * @property {string} city - City where the advocate is located
 * @property {string} degree - Educational degree of the advocate
 * @property {string[]} specialties - List of medical specialties
 * @property {number} yearsOfExperience - Years of professional experience
 * @property {number} phoneNumber - Contact phone number
 * @property {string} [createdAt] - Optional creation timestamp
 */
export interface Advocate {
  id: number;
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: number;
  createdAt?: string;
}

/**
 * Result structure for advocate queries with pagination
 * @interface AdvocateQueryResult
 * @property {Advocate[]} data - Array of advocate data
 * @property {PaginationInfo} pagination - Pagination metadata
 * @property {boolean} [isStaticData] - Whether data is from static source (not database)
 */
export interface AdvocateQueryResult extends PaginatedResult<Advocate> {
  isStaticData?: boolean;
}
