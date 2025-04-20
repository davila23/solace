import { NextRequest, NextResponse } from 'next/server';
import { sql } from 'drizzle-orm';
import db from '@/db';

/**
 * Endpoint to verify the database initialization status
 * GET /api/database/status
 */
export async function GET(request: NextRequest) {
  try {
    
    // Check if tables exist and have data
    let isInitialized = false;
    let message = 'Checking database status...';
    
    try {
      const dbClient = db as any;
      
      // Check users table
      const usersResult = await dbClient.execute(sql`SELECT COUNT(*) as count FROM users`);
      const userCount = usersResult[0]?.count || 0;
      
      // Check advocates table
      const advocatesResult = await dbClient.execute(sql`SELECT COUNT(*) as count FROM advocates`);
      const advocateCount = advocatesResult[0]?.count || 0;
      
      if (userCount > 0 && advocateCount > 0) {
        isInitialized = true;
        message = 'Database initialized successfully.';
      } else {
        message = 'Waiting for initial data loading...';
      }
    } catch (error) {
      message = 'Waiting for table creation...';
    }
    
    return NextResponse.json({
      initialized: isInitialized,
      message,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error checking database status:', error);
    return NextResponse.json(
      { 
        initialized: false, 
        error: 'Error checking database status',
        message: 'Database connection error.'
      }, 
      { status: 500 }
    );
  }
}
