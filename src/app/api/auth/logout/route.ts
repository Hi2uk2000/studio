import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // TODO: Invalidate the user's refresh token in the database

    // Clear the refresh token cookie
    const response = NextResponse.json({ success: true, data: { message: 'Logged out successfully' } });
    response.cookies.set('refreshToken', '', { httpOnly: true, secure: true, expires: new Date(0) });

    return response;
  } catch (error) {
    console.error('Logout failed:', error);
    return NextResponse.json(
      { success: false, error: { code: 'LOGOUT_FAILED', message: 'Could not log out user.' } },
      { status: 500 }
    );
  }
}
