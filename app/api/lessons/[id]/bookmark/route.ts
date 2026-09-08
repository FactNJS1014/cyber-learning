import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { toggleBookmark } from '@/lib/db';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await requireAuth();
    const isBookmarked = await toggleBookmark(user.id, id);
    return NextResponse.json({ isBookmarked });
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
