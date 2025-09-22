import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { PropertyDto } from '@/contracts';
import mockDb from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  try {
    // In a real app, the user ID would be extracted from a verified JWT.
    // The middleware (to be updated in the next step) will add this header.
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required.' } },
        { status: 401 }
      );
    }

    // Convert userId from header (string) to a number for comparison
    const numericUserId = parseInt(userId, 10);

    // Filter properties based on the owner_id
    const userProperties = mockDb.properties.filter(
      (p) => p.owner_id === numericUserId
    );

    return NextResponse.json({ success: true, data: userProperties });

  } catch (error) {
    console.error('Failed to fetch properties:', error);
    return NextResponse.json(
      { success: false, error: { code: 'FETCH_FAILED', message: 'Could not fetch properties.' } },
      { status: 500 }
    );
  }
}
