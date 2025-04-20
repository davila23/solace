/**
 * User management API routes for specific user IDs
 * Restricted to admin users only
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '../../../../lib/auth/jwt';
import { checkRole } from '../../../../lib/auth/roles';
import { Role } from '../../../../lib/auth/types';
import { userService } from '../../../../services/users';
import { UpdateUserData } from '../../../../types/users';

/**
 * GET /api/users/[id]
 * Get a user by ID
 * Restricted to admin users
 */
export async function GET(
  request: NextRequest, 
  { params }: { params: { id: string } }
) {
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
    
    // Get user by ID
    const userId = parseInt(params.id);
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }
    
    const user = await userService.getUserById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json(user);
  } catch (error: any) {
    console.error(`Error getting user ${params.id}:`, error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

/**
 * PATCH /api/users/[id]
 * Update a user
 * Restricted to admin users
 */
export async function PATCH(
  request: NextRequest, 
  { params }: { params: { id: string } }
) {
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
    const userData = await request.json() as UpdateUserData;
    
    // Get user by ID
    const userId = parseInt(params.id);
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }
    
    // Update user
    const updatedUser = await userService.updateUser(userId, userData);
    
    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error(`Error updating user ${params.id}:`, error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/users/[id]
 * Delete a user
 * Restricted to admin users
 */
export async function DELETE(
  request: NextRequest, 
  { params }: { params: { id: string } }
) {
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
    
    // Get user by ID
    const userId = parseInt(params.id);
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }
    
    // Delete user
    const success = await userService.deleteUser(userId);
    if (!success) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error(`Error deleting user ${params.id}:`, error);
    
    // Handle specific error cases
    if (error.message.includes('Cannot delete the last admin')) {
      return NextResponse.json(
        { error: 'Cannot delete the last admin user' }, 
        { status: 400 }
      );
    }
    
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
