/**
 * API Routes for individual advocate operations
 * Handles GET, PATCH, and DELETE for /api/advocates/[id]
 */

import { NextRequest } from 'next/server';
import { advocateService } from '../../../../services/advocates';
import { requireAdmin } from '../../../../lib/auth/middleware';
import { successResponse, errorResponse, handleApiError } from '../../../../utils/api-response';
import { validateRequiredFields } from '../../../../utils/validation';

/**
 * GET /api/advocates/[id]
 * Get a single advocate by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return errorResponse('Invalid advocate ID', 400);
    }
    
    const advocate = await advocateService.getAdvocateById(id);
    
    if (!advocate) {
      return errorResponse(`Advocate with ID ${id} not found`, 404);
    }
    
    // Returns advocate data in format compatible with frontend components
    return Response.json(advocate);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PATCH /api/advocates/[id]
 * Update an advocate (admin only)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authorization
    const authResult = requireAdmin(request);
    if (authResult) {
      return authResult.error;
    }
    
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return errorResponse('Invalid advocate ID', 400);
    }
    
    // Parse request body
    const updateData = await request.json();
    
    // No validation for required fields - PATCH allows partial updates
    // Only validate fields that are present
    const fieldsToValidate = [
      'firstName', 'lastName', 'city', 'degree', 'specialties', 
      'yearsOfExperience', 'phoneNumber'
    ].filter(field => field in updateData);
    
    if (fieldsToValidate.length > 0) {
      const validationResult = validateRequiredFields(updateData, fieldsToValidate);
      if (validationResult) {
        return validationResult.error;
      }
    }
    
    // Update advocate
    const updatedAdvocate = await advocateService.updateAdvocate(id, updateData);
    
    return successResponse(updatedAdvocate);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/advocates/[id]
 * Delete an advocate (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authorization
    const authResult = requireAdmin(request);
    if (authResult) {
      return authResult.error;
    }
    
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return errorResponse('Invalid advocate ID', 400);
    }
    
    // Delete advocate
    const success = await advocateService.deleteAdvocate(id);
    
    if (!success) {
      return errorResponse(`Advocate with ID ${id} not found`, 404);
    }
    
    return successResponse({ message: 'Advocate deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
