import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { RegisterDto, UserDto } from '@/contracts';
import mockDb from '@/lib/mock-data';

export async function POST(request: NextRequest) {
  try {
    const body: RegisterDto = await request.json();
    const { email, password, first_name, last_name, phone_number } = body;

    // --- Mock Implementation ---

    // 1. Input validation (basic)
    if (!email || !password || !first_name || !last_name) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Missing required fields.' } },
        { status: 400 }
      );
    }

    // 2. Check if user already exists
    const existingUser = mockDb.users.find((user) => user.email === email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: { code: 'USER_EXISTS', message: 'A user with this email already exists.' } },
        { status: 409 } // 409 Conflict
      );
    }

    // 3. "Hash" password (in a real app, use bcrypt.hash)
    const passwordHash = `$2b$10$fake.hash.for.${password}`;

    // 4. Create new user object
    const newUser: UserDto & { passwordHash: string } = {
      user_id: mockDb.users.length + 1, // Simple ID generation
      email,
      first_name,
      last_name,
      phone_number,
      passwordHash,
      email_verified: false,
      is_active: true,
      account_status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // 5. Add to in-memory store
    mockDb.users.push(newUser);

    // Don't return the password hash in the response
    const { passwordHash: _, ...userResponse } = newUser;

    return NextResponse.json({ success: true, data: userResponse }, { status: 201 });
  } catch (error) {
    console.error('Registration failed:', error);
    return NextResponse.json(
      { success: false, error: { code: 'REGISTRATION_FAILED', message: 'Could not register user.' } },
      { status: 500 }
    );
  }
}
