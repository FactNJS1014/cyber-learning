import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { getAdminAnalytics } from '@/lib/db';

export async function GET() {
  try {
    await requireAdmin();
    const analytics = await getAdminAnalytics();
    return NextResponse.json({ success: true, analytics });
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (err.message === 'FORBIDDEN') return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    console.error('Admin analytics error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
