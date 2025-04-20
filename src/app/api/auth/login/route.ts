import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { generateToken } from '../../../../lib/auth/jwt';
import { Role } from '../../../../lib/auth/types';
import { authService } from '../../../../services/auth';
import { userRepository } from '../../../../repositories/users';
import { verifyPassword } from '../../../../lib/auth/utils';

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: User login
 *     description: Authenticates a user and returns a JWT token in an HTTP-only cookie
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Invalid username or password'
 */
export async function POST(request: Request) {
  try {
    // Log para depuración - verificar que la ruta está siendo llamada
    console.log('Login API route called');
    
    const { username, password } = await request.json();

    // Validar datos de entrada
    if (!username || !password) {
      console.log('Login failed: Username and password are required');
      return NextResponse.json(
        { message: 'Username and password are required' }, 
        { status: 400 }
      );
    }

    // Autenticar al usuario directamente (por si hay problemas con el servicio)
    let userInfo;
    
    try {
      // First try with the service
      userInfo = await authService.authenticate({ username, password });
    } catch (serviceError) {
      console.log('Auth service error:', serviceError);
      // Fallback direct authentication
      const user = await userRepository.findByUsername(username);
      if (user && verifyPassword(password, user.passwordHash)) {
        userInfo = {
          id: user.id,
          username: user.username,
          name: user.name,
          role: user.role
        };
      }
    }
    
    // Logs para depuración
    console.log(`Login attempt: user=${username}, authenticated=${!!userInfo}`);
    
    if (!userInfo) {
      console.log('Login failed: Invalid credentials for', username);
      return NextResponse.json(
        { message: 'Invalid username or password' }, 
        { status: 401 }
      );
    }

    // Generar token JWT
    const token = generateToken({
      userId: userInfo.id,
      username: userInfo.username,
      role: userInfo.role as Role,
    });

    // Establecer cookie con el token
    cookies().set({
      name: 'auth-token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 24 horas
      path: '/',
    });

    return NextResponse.json({ 
      success: true,
      user: userInfo
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'An error occurred during login' }, 
      { status: 500 }
    );
  }
}
