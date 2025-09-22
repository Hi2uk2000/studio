import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Placeholder for the authentication logic
  const isAuthenticated = false; // TODO: Replace with actual token validation logic
  const token = request.headers.get('authorization')?.split(' ')[1];

  console.log(`Middleware processing request for: ${pathname}`);
  console.log(`Auth token found: ${!!token}`);

  // TODO: Add logic to verify the JWT token (check signature, expiration)
  // Example:
  // if (token) {
  //   try {
  //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //     isAuthenticated = true;
  //     // You can also attach the user to the request headers to be used in API routes
  //     // const headers = new Headers(request.headers);
  //     // headers.set('x-user-id', decoded.sub);
  //     // return NextResponse.next({ headers });
  //   } catch (error) {
  //     console.error('JWT verification failed:', error);
  //     isAuthenticated = false;
  //   }
  // }

  // If the route is an API route and the user is not authenticated, deny access
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/auth')) {
    if (!isAuthenticated) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required.' } },
        { status: 401 }
      );
    }
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - / (the root page, if it's public)
     * - /login, /register (public pages)
     */
    '/api/:path*',
    // Add other paths that need protection here
    '/dashboard/:path*',
    '/properties/:path*',
    '/assets/:path*',
  ],
};
