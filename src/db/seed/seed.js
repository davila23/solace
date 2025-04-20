#!/usr/bin/env node

/**
 * Script to load initial data into the database
 * This file is executed with the command: npm run db:seed
 */

const { drizzle } = require('drizzle-orm/postgres-js');
const { sql } = require('drizzle-orm');
const postgres = require('postgres');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Get database URL
const dbUrl = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost/solaceassignment';

// Direct data definition in this file to simplify the process
// and avoid import issues between JavaScript and TypeScript

// Import schema and utilities
const { advocates: advocatesSchema, users: usersSchema } = require('./db-schema');

// Import hashPassword function
const authUtils = require('../../lib/auth/utils');

// Specialty data for random generation
const specialties = [
  "Bipolar", "LGBTQ", "Medication/Prescribing", "General Mental Health",
  "Men's issues", "Trauma & PTSD", "Personal growth", "Substance use/abuse",
  "Pediatrics", "Chronic pain", "Weight loss & nutrition", "Eating disorders",
  "Life coaching"
];

// Function to generate random specialties for seed data
function getRandomSpecialties() {
  const count = Math.floor(Math.random() * 3) + 1; // 1-3 specialties
  const start = Math.floor(Math.random() * (specialties.length - count));
  return specialties.slice(start, start + count);
}
const hashPassword = authUtils.hashPassword;

// User data with proper password hashes
const userData = [
  {
    username: 'admin',
    passwordHash: hashPassword('admin123'),
    role: 'admin',
    name: 'Administrator',
  },
  {
    username: 'user',
    passwordHash: hashPassword('user123'),
    role: 'user',
    name: 'Test User',
  }
];

// Complete advocate data based on original file
const advocateData = [
  {
    firstName: "John",
    lastName: "Doe",
    city: "New York",
    degree: "MD",
    specialties: getRandomSpecialties(),
    yearsOfExperience: 10,
    phoneNumber: 5551234567,
  },
  {
    firstName: "Jane",
    lastName: "Smith",
    city: "Los Angeles",
    degree: "PhD",
    specialties: getRandomSpecialties(),
    yearsOfExperience: 8,
    phoneNumber: 5559876543,
  },
  {
    firstName: "Alice",
    lastName: "Johnson",
    city: "Chicago",
    degree: "MSW",
    specialties: getRandomSpecialties(),
    yearsOfExperience: 5,
    phoneNumber: 5554567890,
  },
  {
    firstName: "Michael",
    lastName: "Brown",
    city: "Houston",
    degree: "MD",
    specialties: getRandomSpecialties(),
    yearsOfExperience: 12,
    phoneNumber: 5556543210,
  },
  {
    firstName: "Emily",
    lastName: "Davis",
    city: "Phoenix",
    degree: "PsyD",
    specialties: getRandomSpecialties(),
    yearsOfExperience: 7,
    phoneNumber: 5550123456,
  },
  {
    firstName: "Robert",
    lastName: "Wilson",
    city: "San Francisco",
    degree: "MD",
    specialties: getRandomSpecialties(),
    yearsOfExperience: 15,
    phoneNumber: 5559876541,
  },
  {
    firstName: "Sarah",
    lastName: "Martinez",
    city: "Philadelphia",
    degree: "MSW",
    specialties: getRandomSpecialties(),
    yearsOfExperience: 9,
    phoneNumber: 5557890123,
  },
  {
    firstName: "Jessica",
    lastName: "Taylor",
    city: "San Antonio",
    degree: "MD",
    specialties: getRandomSpecialties(),
    yearsOfExperience: 11,
    phoneNumber: 5554561234,
  },
  {
    firstName: "David",
    lastName: "Harris",
    city: "San Diego",
    degree: "PhD",
    specialties: getRandomSpecialties(),
    yearsOfExperience: 6,
    phoneNumber: 5552345678,
  },
  {
    firstName: "Daniel",
    lastName: "Clark",
    city: "Dallas",
    degree: "LMFT",
    specialties: getRandomSpecialties(),
    yearsOfExperience: 14,
    phoneNumber: 5558765432,
  },
  {
    firstName: "Jennifer",
    lastName: "Lewis",
    city: "Denver",
    degree: "MD",
    specialties: getRandomSpecialties(),
    yearsOfExperience: 13,
    phoneNumber: 5553456789,
  },
  {
    firstName: "Elizabeth",
    lastName: "Walker",
    city: "Austin",
    degree: "PsyD",
    specialties: getRandomSpecialties(),
    yearsOfExperience: 9,
    phoneNumber: 5559870123,
  }
];

// Load seed data definitions

// Create tables directly if they don't exist
async function createTablesIfNeeded(db) {
  console.log('🔄 Tables not found. Creating them directly...');
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "advocates" (
        "id" serial PRIMARY KEY NOT NULL,
        "first_name" text NOT NULL,
        "last_name" text NOT NULL,
        "city" text NOT NULL,
        "degree" text NOT NULL,
        "specialties" jsonb DEFAULT '[]'::jsonb NOT NULL,
        "years_of_experience" integer NOT NULL,
        "phone_number" bigint NOT NULL,
        "created_at" timestamp DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS "users" (
        "id" serial PRIMARY KEY NOT NULL,
        "username" varchar(50) NOT NULL,
        "password_hash" text NOT NULL,
        "role" varchar(20) DEFAULT 'user' NOT NULL,
        "name" varchar(100) NOT NULL,
        "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "users_username_unique" UNIQUE("username")
      );
    `);
    console.log('✅ Tables created successfully');
    return true;
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    return false;
  }
}

// Main function to load data
async function main() {
  console.log('🌱 Database initialization starting');
  
  try {
    // Create Postgres client for migrations
    const client = postgres(dbUrl);
    const db = drizzle(client);
    
    // Check if tables exist and create them if needed
    let tablesExist = true;
    let userCount = 0;
    let advocateCount = 0;
    
    try {
      // Try to query the users table
      const usersResult = await db.execute(sql`SELECT COUNT(*) as count FROM users`);
      userCount = parseInt(usersResult[0]?.count || '0');
      
      // Try to query the advocates table
      const advocatesResult = await db.execute(sql`SELECT COUNT(*) as count FROM advocates`);
      advocateCount = parseInt(advocatesResult[0]?.count || '0');
      
      // Tables exist, continue
    } catch (e) {
      console.log('⚠️ Creating database tables...');
      tablesExist = false;
      
      // Try to create tables
      const tablesCreated = await createTablesIfNeeded(db);
      if (!tablesCreated) {
        console.error('❌ Database initialization failed');
        process.exit(1);
      }
      
      // Tables were just created, so counts should be 0
      userCount = 0;
      advocateCount = 0;
    }
    
    // Skip redundant logging
    
    // Get RESET_DATABASE value from environment
    const resetDatabase = process.env.RESET_DATABASE === 'true';
    
    // Show reset status only if enabled
    if (resetDatabase) {
      console.log('🔄 Resetting database to initial state');
    }
    
    // Always load data into freshly created tables
    // or if RESET_DATABASE is true, or if tables exist but are empty
    if (!tablesExist || resetDatabase || userCount === 0) {
      // Load users silently
      for (const user of userData) {
        // Use current date as createdAt
        const createdAt = new Date().toISOString();
        
        await db.execute(sql`
          INSERT INTO users (username, password_hash, role, name, created_at) 
          VALUES (${user.username}, ${user.passwordHash}, ${user.role}, ${user.name}, ${createdAt})
          ON CONFLICT (username) DO NOTHING
        `);
      }
    } else {
      // Skip loading
    }
    
    if (!tablesExist || resetDatabase || advocateCount === 0) {
      // Load advocates silently
      for (const advocate of advocateData) {
        // Use current date as createdAt
        const createdAt = new Date().toISOString();
        
        await db.execute(sql`
          INSERT INTO advocates (first_name, last_name, city, degree, specialties, years_of_experience, phone_number, created_at) 
          VALUES (${advocate.firstName}, ${advocate.lastName}, ${advocate.city}, ${advocate.degree}, ${JSON.stringify(advocate.specialties)}, ${advocate.yearsOfExperience}, ${advocate.phoneNumber}, ${createdAt})
        `);
      }
    } else {
      // Skip loading
    }
    
    // Get final counts for summary
    try {
      const finalUsersResult = await db.execute(sql`SELECT COUNT(*) as count FROM users`);
      const finalAdvocatesResult = await db.execute(sql`SELECT COUNT(*) as count FROM advocates`);
      const finalUserCount = parseInt(finalUsersResult[0]?.count || '0');
      const finalAdvocateCount = parseInt(finalAdvocatesResult[0]?.count || '0');
      
      // We only need one clear final message
      console.log(`📊 Database ready with ${finalUserCount} users and ${finalAdvocateCount} advocates`);
    } catch (error) {
      console.error('❌ Database error:', error.message);
    }
    
    // Close the connection when finished
    await client.end();
    
  } catch (error) {
    console.error('❌ Error loading initial data:', error);
    process.exit(1);
  }
}

// Execute the main function
main();
