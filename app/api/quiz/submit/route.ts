import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { submitQuizAttempt, recordAuditLog } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { quizId, answers } = await req.json();

    if (!quizId || !answers || typeof answers !== 'object') {
      return NextResponse.json({ error: 'Quiz ID and answers payload are required' }, { status: 400 });
    }

    const attempt = await submitQuizAttempt(user.id, quizId, answers);

    await recordAuditLog({
      userId: user.id,
      userName: user.name,
      action: attempt.passed ? 'QUIZ_PASSED' : 'QUIZ_FAILED',
      resource: 'QuizAttempt',
      resourceId: attempt.id,
      metadata: {
        quizId,
        score: attempt.score,
        total: attempt.totalQuestions,
        percentage: attempt.percentage,
        passed: attempt.passed,
      },
    });

    return NextResponse.json({
      success: true,
      score: attempt.score,
      totalQuestions: attempt.totalQuestions,
      percentage: attempt.percentage,
      passed: attempt.passed,
      correctCount: attempt.score,
      incorrectCount: attempt.totalQuestions - attempt.score,
      reviewDetails: attempt.reviewDetails,
      createdAt: attempt.createdAt,
    });
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Quiz submission error:', err);
    return NextResponse.json({ error: err.message || 'Failed to grade quiz' }, { status: 500 });
  }
}
