import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth/jwt';
import { Role } from './lib/auth/types';

// Public paths that don't require authentication
const publicPaths = [
  '/login', 
  '/api/auth/login', 
  '/api/seed', 
  '/api/database/status', 
  '/api/debug',
  '/api/init-db',
  '/_next',
  '/favicon.ico',
  '/sw.js'
];

// Helper to check if a path is public
const isPublicPath = (path: string) => {
  return publicPaths.some(publicPath => 
    path === publicPath || 
    path.startsWith(`${publicPath}/`) ||
    // Bypass static assets
    path.startsWith('/_next/') ||
    path.includes('.ico') ||
    path.includes('.js') ||
    path.includes('.css') ||
    path.includes('.png') ||
    path.includes('.jpg') ||
    path.includes('.svg')
  );
};

/**
 * Next.js middleware for authentication and authorization
 */
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Bypass middleware para recursos estáticos y rutas públicas
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Verify JWT token
  const token = request.cookies.get('auth-token')?.value;
  
  if (!token) {
    // Redirect API requests to error response, UI requests to login
    if (request.nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    } else {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  try {
    // Verify and decode token
    const decoded = verifyToken(token);
    
    // Check if accessing admin routes with non-admin role
    if (
      request.nextUrl.pathname.startsWith('/admin') && 
      decoded && decoded.role !== Role.ADMIN
    ) {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }
    
    return NextResponse.next();
  } catch (error) {
    // Token invalid or expired
    // Clear invalid token and redirect to login
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('auth-token');
    return response;
  }
}
