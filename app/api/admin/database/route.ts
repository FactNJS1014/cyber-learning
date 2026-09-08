import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { getDatabaseStats } from '@/lib/neon';
import { getDb, syncLocalToNeon, getAllUsers } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
    const db = getDb();

    const localCounts = {
      users: db.users.length,
      sessions: db.sessions.length,
      lessons: db.lessons.length,
      quizzes: db.quizzes.length,
      quizAttempts: db.quizAttempts.length,
      lessonProgress: db.lessonProgress.length,
      auditLogs: db.auditLogs.length,
    };

    const stats = await getDatabaseStats(localCounts);
    const users = await getAllUsers();
    const safeUsers = users.map((u) => {
      const { passwordHash: _, ...safe } = u;
      return safe;
    });

    return NextResponse.json({
      stats,
      users: safeUsers,
    });
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (err.message === 'FORBIDDEN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    return NextResponse.json({ error: err.message || 'Database status lookup failed' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const result = await syncLocalToNeon();
    return NextResponse.json(result);
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (err.message === 'FORBIDDEN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    return NextResponse.json({ error: err.message || 'Sync failed' }, { status: 500 });
  }
}
