import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { verifyToken } from '../../../../lib/auth/jwt';
import { eq } from 'drizzle-orm';
import db from '../../../../db';
import { users } from '../../../../db/schema';

/**
 * @swagger
 * /api/auth/check:
 *   get:
 *     tags: [Authentication]
 *     summary: Check authentication status
 *     description: Verifies the JWT token in cookies and returns user info if valid
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Authentication status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 authenticated:
 *                   type: boolean
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 authenticated:
 *                   type: boolean
 *                   example: false
 */
export async function GET() {
  try {
    const token = cookies().get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { authenticated: false }, 
        { status: 401 }
      );
    }
    
    const decodedToken = verifyToken(token);
    
    if (!decodedToken) {
      return NextResponse.json(
        { authenticated: false }, 
        { status: 401 }
      );
    }
    
    // Buscar usuario en la base de datos
    let matchingUser;
    
    // Si es InMemoryDatabase
    if ('getUserById' in db) {
      matchingUser = (db as any).getUserById(decodedToken.userId);
    } else {
      // Si es base de datos real
      const results = await db.select().from(users).where(eq(users.id, decodedToken.userId));
      matchingUser = results[0];
    }
    
    if (!matchingUser) {
      return NextResponse.json(
        { authenticated: false }, 
        { status: 401 }
      );
    }
    
    // Preparar objeto de usuario para retornar (sin contraseña)
    const userInfo = {
      id: matchingUser.id,
      username: matchingUser.username,
      role: matchingUser.role,
      name: matchingUser.name
    };
    
    return NextResponse.json({
      authenticated: true,
      user: userInfo
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { message: 'An error occurred during authentication check' }, 
      { status: 500 }
    );
  }
}
