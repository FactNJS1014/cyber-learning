import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { getAllUsers, updateUser, deleteUser, recordAuditLog, getUserProgress, getDb } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get('q')?.toLowerCase();
    const role = searchParams.get('role');

    let users = await getAllUsers();

    if (query) {
      users = users.filter(
        (u) => u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query)
      );
    }

    if (role && (role === 'STUDENT' || role === 'ADMIN')) {
      users = users.filter((u) => u.role === role);
    }

    const db = getDb();
    const safeUsers = users.map((u) => {
      const { passwordHash, ...safe } = u;
      const progress = db.lessonProgress.filter((p) => p.userId === u.id && p.isCompleted).length;
      const cert = db.certificates.some((c) => c.userId === u.id);
      return {
        ...safe,
        completedLessonsCount: progress,
        hasCertificate: cert,
      };
    });

    return NextResponse.json({ users: safeUsers });
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (err.message === 'FORBIDDEN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const { userId, role, status, name } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const updates: any = {};
    if (role) updates.role = role;
    if (status) updates.status = status;
    if (name) updates.name = name.trim();

    const updated = await updateUser(userId, updates);
    if (!updated) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await recordAuditLog({
      userId: admin.id,
      userName: admin.name,
      action: 'UPDATE_USER_ROLE_STATUS',
      resource: 'User',
      resourceId: userId,
      metadata: updates,
    });

    const { passwordHash, ...safeUser } = updated;
    return NextResponse.json({ message: 'User updated successfully', user: safeUser });
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (err.message === 'FORBIDDEN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    if (userId === admin.id) {
      return NextResponse.json({ error: 'Admin cannot delete their own active account' }, { status: 400 });
    }

    const deleted = await deleteUser(userId);
    if (!deleted) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await recordAuditLog({
      userId: admin.id,
      userName: admin.name,
      action: 'DELETE_USER',
      resource: 'User',
      resourceId: userId,
    });

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (err.message === 'FORBIDDEN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
