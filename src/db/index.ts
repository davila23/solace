import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { sql } from "drizzle-orm";
import { users } from './schema';

/**
 * Database connection module
 * Provides a singleton pattern for database connections
 */

// Global variables to track database connection across hot reloads
const globalThis: any = global;
globalThis.__DB_CONNECTION__ = globalThis.__DB_CONNECTION__ || {
  db: null,
  client: null,
  initialized: false
};

/**
 * Get database connection using singleton pattern
 * Creates a PostgreSQL connection if it doesn't exist yet
 * @returns The database instance
 */
export function getDb(): PostgresJsDatabase {
  // Return existing connection if available
  if (globalThis.__DB_CONNECTION__.db) {
    return globalThis.__DB_CONNECTION__.db;
  }
  
  // Validate database URL
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set in environment variables');
  }
  
  // Create connection (only once per server process)
  const client = postgres(process.env.DATABASE_URL);
  const db = drizzle(client);
  
  // Store in global state
  globalThis.__DB_CONNECTION__.client = client;
  globalThis.__DB_CONNECTION__.db = db;
  
  // Initialize connection only once
  if (!globalThis.__DB_CONNECTION__.initialized && typeof window === 'undefined') {
    globalThis.__DB_CONNECTION__.initialized = true;
    verifyConnection(db).catch(console.error);
  }
  
  return db;
}

/**
 * Verify database connection with a simple query
 * This is called only once per server startup
 */
async function verifyConnection(db: PostgresJsDatabase) {
  try {
    // Simple query to verify connection
    await db.select({ count: sql`COUNT(*)` }).from(users);
  } catch (error) {
    console.error('❌ Database connection error:', error);
  }
}

/**
 * Available specialties for advocates
 * Ideally this would be in its own database table in production
 */
export const specialties = [
  "Bipolar", "LGBTQ", "Medication/Prescribing", "General Mental Health",
  "Men's issues", "Trauma & PTSD", "Personal growth", "Substance use/abuse",
  "Pediatrics", "Chronic pain", "Weight loss & nutrition", "Eating disorders",
  "Life coaching"
];

/**
 * Generate random specialties for seed data
 * @returns Array of 1-3 random specialties
 */
export function getRandomSpecialties() {
  const count = Math.floor(Math.random() * 3) + 1; // 1-3 specialties
  const start = Math.floor(Math.random() * (specialties.length - count));
  return specialties.slice(start, start + count);
}

// Export a configured database instance as default
export default getDb();
