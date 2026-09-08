import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getQuizForStudent, getDb } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await requireAuth();

    const quizData = await getQuizForStudent(id);
    if (!quizData) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    const db = getDb();
    const attempts = db.quizAttempts
      .filter((a) => a.userId === user.id && a.quizId === quizData.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({
      quiz: quizData,
      previousAttemptsCount: attempts.length,
      bestScore: attempts.length > 0 ? Math.max(...attempts.map((a) => a.percentage)) : null,
      latestPassed: attempts.some((a) => a.passed),
    });
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized. Please login to access the quiz.' }, { status: 401 });
    }
    console.error('Quiz fetch error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
