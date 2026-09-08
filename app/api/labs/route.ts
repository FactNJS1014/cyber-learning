import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getAllLabs, getLabProgress } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const labs = await getAllLabs();

    const userProgress = user ? await getLabProgress(user.id) : [];
    const completedLabIds = new Set(userProgress.filter((p) => p.isCompleted).map((p) => p.labId));

    const enriched = labs.map((lab) => ({
      ...lab,
      isCompleted: completedLabIds.has(lab.id),
    }));

    return NextResponse.json({ labs: enriched });
  } catch (err: any) {
    console.error('Error fetching labs:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
