import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { submitFinalProject, getUserProgress, recordAuditLog } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const progress = await getUserProgress(user.id);

    // Validate that project is unlocked
    if (!progress.finalProject.isUnlocked) {
      return NextResponse.json(
        {
          error: 'LOCKED',
          message: 'Final Project is locked. You must complete all Basic, Intermediate, and Advanced modules and pass all lesson quizzes before submitting.',
        },
        { status: 403 }
      );
    }

    const {
      projectId,
      title,
      description,
      testingScope,
      methodology,
      findings,
      recommendations,
      reportUrl,
    } = await req.json();

    if (!title || !testingScope || !methodology || !findings || !recommendations) {
      return NextResponse.json(
        { error: 'All project report fields (Title, Scope, Methodology, Findings, Recommendations) are required.' },
        { status: 400 }
      );
    }

    // Safety checks: Ensure no real credentials/passwords or external unauthorized domains
    const contentCheck = `${testingScope} ${methodology} ${findings} ${recommendations}`.toLowerCase();
    if (
      contentCheck.includes('password=') ||
      contentCheck.includes('aws_secret') ||
      contentCheck.includes('private_key') ||
      contentCheck.includes('-----begin rsa private key-----')
    ) {
      return NextResponse.json(
        { error: 'Security Violation: Submission must not contain live passwords, API secrets, or private keys.' },
        { status: 400 }
      );
    }

    const submission = await submitFinalProject(user.id, {
      projectId: projectId || 'final-proj-01',
      title: title.trim(),
      description: (description || '').trim(),
      testingScope: testingScope.trim(),
      methodology: methodology.trim(),
      findings: findings.trim(),
      recommendations: recommendations.trim(),
      reportUrl: reportUrl || undefined,
    });

    await recordAuditLog({
      userId: user.id,
      userName: user.name,
      action: 'SUBMIT_FINAL_PROJECT',
      resource: 'ProjectSubmission',
      resourceId: submission.id,
      metadata: { title: submission.title },
    });

    return NextResponse.json({
      message: 'Final Security Project submitted successfully. An instructor will review your report according to the 100-point rubric.',
      submission,
    });
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    console.error('Final project submission error:', err);
    return NextResponse.json({ error: 'Failed to submit project' }, { status: 500 });
  }
}
