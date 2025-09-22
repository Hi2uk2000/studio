import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { LoginDto, LoginResponseDto } from '@/contracts';
import mockDb from '@/lib/mock-data';

export async function POST(request: NextRequest) {
  try {
    const body: LoginDto = await request.json();
    const { email, password } = body;

    // --- Mock Implementation ---

    // 1. Input validation (basic)
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Email and password are required.' } },
        { status: 400 }
      );
    }

    // 2. Find user in the mock database
    const user = mockDb.users.find((u) => u.email === email);

    // 3. "Compare" password (in a real app, use bcrypt.compare)
    // For this mock, we'll just check if the user exists. A real implementation would compare hashes.
    // A more realistic mock could be: const isMatch = user.passwordHash === `$2b$10$fake.hash.for.${password}`;
    const isMatch = !!user;

    if (!user || !isMatch) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' } },
        { status: 401 }
      );
    }

    // 4. Generate a placeholder JWT
    const token = `mock.jwt.${Buffer.from(JSON.stringify({ sub: user.user_id })).toString('base64')}`;

    // 5. Create the response DTO
    const { passwordHash: _, ...userResponse } = user;
    const response: LoginResponseDto = {
      token,
      user: userResponse,
    };

    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    console.error('Login failed:', error);
    return NextResponse.json(
      { success: false, error: { code: 'LOGIN_FAILED', message: 'An unexpected error occurred.' } },
      { status: 500 }
    );
  }
}
