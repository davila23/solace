import { NextRequest } from 'next/server';
import { advocateService } from '../../../services/advocates';
import { requireAdmin } from '../../../lib/auth/middleware';
import { successResponse, errorResponse, handleApiError } from '../../../utils/api-response';
import { validateAdvocateData } from '../../../utils/validation';
import { notFound } from 'next/navigation';

/**
 * @swagger
 * /api/advocates:
 *   get:
 *     tags: [Advocates]
 *     summary: Get list of advocates
 *     description: Returns a paginated and filterable list of healthcare advocates
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term to filter by name
 *       - in: query
 *         name: specialty
 *         schema:
 *           type: string
 *         description: Filter by specialty
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filter by city
 *     responses:
 *       200:
 *         description: List of advocates
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Advocate'
 *                 pagination:
 *                   $ref: '#/components/schemas/PaginationInfo'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET(request: Request): Promise<Response> {
  try {
    // Fetches paginated data with extracted and validated query parameters
    const result = await advocateService.getAdvocatesFromRequest(request);
    
    // Returns data in format compatible with frontend components
    return Response.json(result);
  } catch (error) {
    // Transforms error to standardized API response
    return handleApiError(error);
  }
}

/**
 * @swagger
 * /api/advocates:
 *   post:
 *     tags: [Advocates]
 *     summary: Create a new advocate
 *     description: Creates a new healthcare advocate (admin only)
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               city:
 *                 type: string
 *               degree:
 *                 type: string
 *                 enum: [MD, PhD, MSW]
 *               specialties:
 *                 type: array
 *                 items:
 *                   type: string
 *               yearsOfExperience:
 *                 type: integer
 *               phoneNumber:
 *                 type: integer
 *             required:
 *               - firstName
 *               - lastName
 *               - city
 *               - degree
 *               - specialties
 *               - yearsOfExperience
 *               - phoneNumber
 *     responses:
 *       201:
 *         description: Advocate created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 advocate:
 *                   $ref: '#/components/schemas/Advocate'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
export async function POST(request: NextRequest): Promise<Response> {
  try {
    // Verifies user has admin permissions
    const authResult = requireAdmin(request);
    if (authResult) {
      return authResult.error;
    }
    
    // Extracts advocate data from request body
    const advocateData = await request.json();
    
    // Validates advocate data contains all required fields
    const validationResult = validateAdvocateData(advocateData);
    if (validationResult) {
      return validationResult.error;
    }
    
    // Persists new advocate to database
    const newAdvocate = await advocateService.createAdvocate({
      firstName: advocateData.firstName,
      lastName: advocateData.lastName,
      city: advocateData.city,
      degree: advocateData.degree,
      specialties: advocateData.specialties,
      yearsOfExperience: advocateData.yearsOfExperience,
      phoneNumber: advocateData.phoneNumber,
    });
    
    // Returns success response with created advocate
    return successResponse({
      message: 'Advocate created successfully',
      advocate: newAdvocate
    }, 201);
  } catch (error) {
    // Transforms error to standardized API response
    return handleApiError(error);
  }
}

/**
 * @swagger
 * /api/advocates/{id}:
 *   put:
 *     tags: [Advocates]
 *     summary: Update an existing advocate
 *     description: Updates an existing healthcare advocate (admin only)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Advocate ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               city:
 *                 type: string
 *               degree:
 *                 type: string
 *                 enum: [MD, PhD, MSW, LMFT, PsyD]
 *               specialties:
 *                 type: array
 *                 items:
 *                   type: string
 *               yearsOfExperience:
 *                 type: integer
 *               phoneNumber:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Advocate updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 advocate:
 *                   $ref: '#/components/schemas/Advocate'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         description: Advocate not found
 */
export async function PUT(request: NextRequest, { params }: { params: { id: string } }): Promise<Response> {
  try {
    // Verifies user has admin permissions
    const authResult = requireAdmin(request);
    if (authResult) {
      return authResult.error;
    }

    // Extract advocate ID from URL parameters
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return errorResponse('Invalid advocate ID', 400);
    }
    
    // Extracts advocate data from request body
    const advocateData = await request.json();
    
    // Update advocate in database
    try {
      const updatedAdvocate = await advocateService.updateAdvocate(id, advocateData);
      
      // Returns success response with updated advocate
      return successResponse({
        message: 'Advocate updated successfully',
        advocate: updatedAdvocate
      });
    } catch (error: any) {
      if (error.message?.includes('not found')) {
        return errorResponse(`Advocate with ID ${id} not found`, 404);
      }
      throw error;
    }
  } catch (error) {
    // Transforms error to standardized API response
    return handleApiError(error);
  }
}

/**
 * @swagger
 * /api/advocates/{id}:
 *   delete:
 *     tags: [Advocates]
 *     summary: Delete an advocate
 *     description: Deletes an existing healthcare advocate (admin only)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Advocate ID
 *     responses:
 *       200:
 *         description: Advocate deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         description: Advocate not found
 */
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }): Promise<Response> {
  try {
    // Verifies user has admin permissions
    const authResult = requireAdmin(request);
    if (authResult) {
      return authResult.error;
    }

    // Extract advocate ID from URL parameters
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return errorResponse('Invalid advocate ID', 400);
    }
    
    // Delete advocate from database
    const deleted = await advocateService.deleteAdvocate(id);
    
    if (!deleted) {
      return errorResponse(`Advocate with ID ${id} not found`, 404);
    }
    
    // Returns success response
    return successResponse({
      message: 'Advocate deleted successfully'
    });
  } catch (error) {
    // Transforms error to standardized API response
    return handleApiError(error);
  }
}
