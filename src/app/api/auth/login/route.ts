import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { LoginDto, LoginResponseDto } from '@/contracts';

export async function POST(request: NextRequest) {
  try {
    const body: LoginDto = await request.json();

    // TODO: Add input validation
    console.log('Logging in user:', body.email);

    // TODO: Find user in the database by email
    // TODO: Compare hashed password with provided password using bcrypt

    // If credentials are valid:
    // TODO: Generate JWT Access Token
    // TODO: Generate secure Refresh Token and set it in an HttpOnly cookie

    // Placeholder response
    const response: LoginResponseDto = {
      token: 'placeholder.jwt.access.token',
      user: {
        user_id: 1,
        email: body.email,
        first_name: 'John',
        last_name: 'Doe',
        phone_number: '1234567890',
        email_verified: true,
        is_active: true,
        account_status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    };

    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    console.error('Login failed:', error);
    return NextResponse.json(
      { success: false, error: { code: 'LOGIN_FAILED', message: 'Invalid credentials.' } },
      { status: 401 }
    );
  }
}
