import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getLabById, getDb } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: 'Please login to access the security lab.' },
        { status: 401 }
      );
    }

    const lab = await getLabById(id);
    if (!lab) {
      return NextResponse.json({ error: 'Lab not found' }, { status: 404 });
    }

    const db = getDb();
    const progress = db.labProgress.find((p) => p.userId === user.id && p.labId === lab.id);

    return NextResponse.json({
      lab,
      isCompleted: progress?.isCompleted || false,
      userNotes: progress?.notes || '',
    });
  } catch (err: any) {
    console.error('Error fetching lab:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
