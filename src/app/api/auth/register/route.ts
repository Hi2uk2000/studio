import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { RegisterDto } from '@/contracts';

export async function POST(request: NextRequest) {
  try {
    const body: RegisterDto = await request.json();

    // TODO: Add input validation (e.g., with Zod)
    console.log('Registering user:', body.email);

    // TODO: Hash password with bcrypt

    // TODO: Create user in the database

    // Placeholder response
    const newUser = {
      user_id: 1,
      email: body.email,
      first_name: body.first_name,
      last_name: body.last_name,
      phone_number: body.phone_number,
      email_verified: false,
      is_active: true,
      account_status: 'active' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, data: newUser }, { status: 201 });
  } catch (error) {
    console.error('Registration failed:', error);
    return NextResponse.json(
      { success: false, error: { code: 'REGISTRATION_FAILED', message: 'Could not register user.' } },
      { status: 500 }
    );
  }
}
