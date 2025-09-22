import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicApiRoutes = ['/api/auth/login', '/api/auth/register'];

  // If it's a public API route, let it pass
  if (publicApiRoutes.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // For all other API routes, we check for a token
  if (pathname.startsWith('/api/')) {
    const token = request.headers.get('authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Missing authentication token.' } },
        { status: 401 }
      );
    }

    // --- Mock JWT Validation ---
    try {
      // In a real app, you would use a library like 'jsonwebtoken' to verify the signature.
      // Here, we just decode the Base64 payload of our mock token.
      const payloadBase64 = token.split('.')[2];
      if (!payloadBase64) throw new Error('Invalid mock token format');

      const decodedPayload = JSON.parse(Buffer.from(payloadBase64, 'base64').toString('utf-8'));
      const userId = decodedPayload.sub;

      if (!userId) {
        throw new Error('User ID (sub) not found in token payload');
      }

      // The token is "valid", so we add the user ID to the request headers
      // and allow the request to proceed to the API route.
      const headers = new Headers(request.headers);
      headers.set('x-user-id', userId);

      return NextResponse.next({
        request: {
          headers: headers,
        },
      });
    } catch (error) {
      console.error('Mock token validation failed:', error);
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_TOKEN', message: 'Invalid or expired token.' } },
        { status: 401 }
      );
    }
  }

  // Allow non-API requests (e.g., page loads) to proceed without modification
  return NextResponse.next();
}

// Configure the middleware to run on all API routes
export const config = {
  matcher: '/api/:path*',
};
