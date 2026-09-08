import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail } from '@/lib/db';
import { verifyPassword, createAuthSession } from '@/lib/auth';
import { recordAuditLog } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = await findUserByEmail(email.trim());
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    if (user.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Your account is suspended or disabled' }, { status: 403 });
    }

    const isMatch = await verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Create session & set HTTP-only cookie
    const token = await createAuthSession(user.id);

    await recordAuditLog({
      userId: user.id,
      userName: user.name,
      action: 'LOGIN',
      resource: 'User',
      resourceId: user.id,
      metadata: { email: user.email, role: user.role },
    });

    const { passwordHash, ...safeUser } = user;
    return NextResponse.json({ message: 'Login successful', user: safeUser, token }, { status: 200 });
  } catch (err: any) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'An unexpected error occurred during login' }, { status: 500 });
  }
}
