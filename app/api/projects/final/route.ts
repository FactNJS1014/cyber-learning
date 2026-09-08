import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getFinalProject, getUserProgress, getDb } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const project = await getFinalProject();

    if (!user) {
      return NextResponse.json({
        project,
        isUnlocked: false,
        prerequisites: {
          basicCompleted: false,
          intermediateCompleted: false,
          advancedCompleted: false,
          allQuizzesPassed: false,
        },
        userSubmission: null,
      });
    }

    const progress = await getUserProgress(user.id);
    const db = getDb();
    const userSubmission = db.projectSubmissions.find((s) => s.userId === user.id);

    return NextResponse.json({
      project,
      isUnlocked: progress.finalProject.isUnlocked,
      progressData: progress,
      userSubmission: userSubmission || null,
    });
  } catch (err: any) {
    console.error('Error fetching final project:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
