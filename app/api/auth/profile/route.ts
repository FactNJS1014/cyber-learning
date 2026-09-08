import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, verifyPassword, hashPassword } from '@/lib/auth';
import { findUserById, updateUser, recordAuditLog } from '@/lib/db';

export async function PATCH(req: NextRequest) {
  try {
    const authUser = await requireAuth();
    const { name, bio, avatar } = await req.json();

    const updated = await updateUser(authUser.id, {
      name: name ? name.trim() : authUser.name,
      bio: bio !== undefined ? bio.trim() : authUser.bio,
      avatar: avatar !== undefined ? avatar.trim() : authUser.avatar,
    });

    if (!updated) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { passwordHash, ...safeUser } = updated;
    return NextResponse.json({ message: 'Profile updated successfully', user: safeUser });
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
