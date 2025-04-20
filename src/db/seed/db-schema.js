/**
 * JavaScript version of schema for seed scripts
 * This file provides database schema definitions for seeding
 */

const { pgTable, serial, text, jsonb, timestamp, bigint, varchar } = require('drizzle-orm/pg-core');
const { sql } = require('drizzle-orm');

// Define advocates table schema
const advocates = {
  tableName: "advocates",
  columns: {
    id: "id",
    firstName: "first_name",
    lastName: "last_name",
    city: "city",
    degree: "degree",
    specialties: "specialties",
    yearsOfExperience: "years_of_experience",
    phoneNumber: "phone_number",
    createdAt: "created_at"
  }
};

// Define users table schema
const users = {
  tableName: "users",
  columns: {
    id: "id",
    username: "username",
    passwordHash: "password_hash",
    role: "role",
    name: "name",
    createdAt: "created_at"
  }
};

module.exports = {
  advocates,
  users
};
