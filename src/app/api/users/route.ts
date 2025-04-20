/**
 * User management API routes
 * Restricted to admin users only
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '../../../lib/auth/jwt';
import { checkRole } from '../../../lib/auth/roles';
import { Role } from '../../../lib/auth/types';
import { userService } from '../../../services/users';
import { CreateUserData, UpdateUserData } from '../../../types/users';

/**
 * GET /api/users
 * List all users with pagination and search
 * Restricted to admin users
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authentication and admin role
    const authResult = await verifyAuth(request);
    if (!authResult.success) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check for admin role
    if (!checkRole(authResult.token, [Role.ADMIN])) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10;
    const search = searchParams.get('search') || '';
    
    // Get users
    const result = await userService.getUsers({ page, limit, search });
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error listing users:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

/**
 * POST /api/users
 * Create a new user
 * Restricted to admin users
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication and admin role
    const authResult = await verifyAuth(request);
    if (!authResult.success) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check for admin role
    if (!checkRole(authResult.token, [Role.ADMIN])) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Parse request body
    const userData = await request.json() as CreateUserData;
    
    // Validate request body
    if (!userData.username || !userData.password || !userData.name || !userData.role) {
      return NextResponse.json(
        { error: 'Missing required fields: username, password, name, role' }, 
        { status: 400 }
      );
    }
    
    // Create user
    const user = await userService.createUser(userData);
    
    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    console.error('Error creating user:', error);
    const status = error.message.includes('already taken') ? 409 : 500;
    return NextResponse.json({ error: error.message || 'Server error' }, { status });
  }
}
