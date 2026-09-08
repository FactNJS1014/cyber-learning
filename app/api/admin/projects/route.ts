import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { getAllProjectSubmissions, gradeProjectSubmission, recordAuditLog } from '@/lib/db';

export async function GET() {
  try {
    await requireAdmin();
    const submissions = await getAllProjectSubmissions();
    return NextResponse.json({ submissions });
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (err.message === 'FORBIDDEN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const { submissionId, score, scoreBreakdown, feedback } = await req.json();

    if (!submissionId || score === undefined) {
      return NextResponse.json({ error: 'Submission ID and score are required' }, { status: 400 });
    }

    const numScore = Number(score);
    if (isNaN(numScore) || numScore < 0 || numScore > 100) {
      return NextResponse.json({ error: 'Score must be a number between 0 and 100' }, { status: 400 });
    }

    const graded = await gradeProjectSubmission(
      submissionId,
      numScore,
      scoreBreakdown || {},
      feedback || ''
    );

    if (!graded) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    await recordAuditLog({
      userId: admin.id,
      userName: admin.name,
      action: 'GRADE_PROJECT_SUBMISSION',
      resource: 'ProjectSubmission',
      resourceId: submissionId,
      metadata: { score: numScore, passed: numScore >= 70 },
    });

    return NextResponse.json({ message: 'Project graded successfully', submission: graded });
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (err.message === 'FORBIDDEN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    return NextResponse.json({ error: 'Failed to grade submission' }, { status: 500 });
  }
}
