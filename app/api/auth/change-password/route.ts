import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, verifyPassword, hashPassword } from '@/lib/auth';
import { findUserById, updateUser, recordAuditLog } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const authUser = await requireAuth();
    const { currentPassword, newPassword, confirmPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Current password and new password are required' }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'New password must be at least 8 characters' }, { status: 400 });
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return NextResponse.json({ error: 'New passwords do not match' }, { status: 400 });
    }

    const fullUser = await findUserById(authUser.id);
    if (!fullUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const isMatch = await verifyPassword(currentPassword, fullUser.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
    }

    const newHash = await hashPassword(newPassword);
    await updateUser(authUser.id, { passwordHash: newHash });

    await recordAuditLog({
      userId: authUser.id,
      userName: authUser.name,
      action: 'CHANGE_PASSWORD',
      resource: 'User',
      resourceId: authUser.id,
    });

    return NextResponse.json({ message: 'Password updated successfully' });
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
  }
}
