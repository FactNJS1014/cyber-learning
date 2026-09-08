import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { generateCertificate, getUserCertificate, getUserProgress } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();

    // Check existing
    const existing = await getUserCertificate(user.id);
    if (existing) {
      return NextResponse.json({
        message: 'Certificate already issued',
        certificate: existing,
      });
    }

    const progress = await getUserProgress(user.id);

    // Validate prerequisites
    const isEligible =
      progress.levels.basic.percentage === 100 &&
      progress.levels.intermediate.percentage === 100 &&
      progress.levels.advanced.percentage === 100 &&
      progress.finalProject.submission?.status === 'GRADED' &&
      (progress.finalProject.submission.score || 0) >= 70;

    if (!isEligible) {
      return NextResponse.json(
        {
          error: 'INELIGIBLE',
          message: 'To receive your certificate, you must complete all Basic, Intermediate, and Advanced modules and achieve a passing score (≥70/100) on the Final Security Project.',
          progress,
        },
        { status: 400 }
      );
    }

    const cert = await generateCertificate(user.id);
    return NextResponse.json({
      message: 'Congratulations! Your Cyber Security Certificate of Completion has been officially issued.',
      certificate: cert,
    });
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    console.error('Certificate generation error:', err);
    return NextResponse.json({ error: err.message || 'Failed to generate certificate' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();
    const cert = await getUserCertificate(user.id);
    const progress = await getUserProgress(user.id);

    return NextResponse.json({
      certificate: cert,
      progress,
    });
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
