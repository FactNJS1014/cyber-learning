import { NextResponse } from 'next/server';
import { getCurrentUser, clearAuthSession } from '@/lib/auth';
import { recordAuditLog } from '@/lib/db';

export async function POST() {
  try {
    const user = await getCurrentUser();
    if (user) {
      await recordAuditLog({
        userId: user.id,
        userName: user.name,
        action: 'LOGOUT',
        resource: 'User',
        resourceId: user.id,
      });
    }

    await clearAuthSession();
    return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
  } catch (err: any) {
    console.error('Logout error:', err);
    return NextResponse.json({ error: 'Failed to log out' }, { status: 500 });
  }
}
