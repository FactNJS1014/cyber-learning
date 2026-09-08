import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { markLabCompleted, recordAuditLog } from '@/lib/db';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await requireAuth();
    const { notes } = await req.json().catch(() => ({}));

    const progress = await markLabCompleted(user.id, id, notes);

    await recordAuditLog({
      userId: user.id,
      userName: user.name,
      action: 'LAB_COMPLETED',
      resource: 'Lab',
      resourceId: id,
    });

    return NextResponse.json({ message: 'Lab marked as completed', progress });
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
