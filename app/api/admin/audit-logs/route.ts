import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { getAuditLogs } from '@/lib/db';

export async function GET() {
  try {
    await requireAdmin();
    const logs = await getAuditLogs();
    return NextResponse.json({ logs });
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (err.message === 'FORBIDDEN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
