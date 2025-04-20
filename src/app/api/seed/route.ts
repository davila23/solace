import db from "../../../db";
import { advocates, users } from "../../../db/schema";
import { hashPassword } from "../../../lib/auth/utils";

// Define the data inline since the original imports don't exist as separate files
// These mirror the data from seed.js
const specialties = [
  "Bipolar", "LGBTQ", "Medication/Prescribing", "General Mental Health",
  "Men's issues", "Trauma & PTSD", "Personal growth", "Substance use/abuse",
  "Pediatrics", "Chronic pain", "Weight loss & nutrition", "Eating disorders",
  "Life coaching"
];

// Function to generate random specialties
function getRandomSpecialties() {
  const count = Math.floor(Math.random() * 3) + 1; // 1-3 specialties
  const start = Math.floor(Math.random() * (specialties.length - count));
  return specialties.slice(start, start + count);
}

// User data
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

// Sample advocate data
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
  }
];

/**
 * API route for seeding the database with initial data
 * Populates advocates and users tables
 */
export async function POST() {
  try {
    // Insert advocates data
    const advocateRecords = await db.insert(advocates).values(advocateData).returning();
    
    // Insert user data
    const userRecords = await db.insert(users).values(userData).returning();

    return Response.json({ 
      success: true,
      advocates: advocateRecords.length,
      users: userRecords.map(user => ({
        id: user.id,
        username: user.username,
        role: user.role,
        name: user.name
      }))
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    return Response.json({ 
      success: false, 
      error: 'Failed to seed database' 
    }, { status: 500 });
  }
}
