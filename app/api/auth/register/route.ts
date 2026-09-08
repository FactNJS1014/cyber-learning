import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, createUser, recordAuditLog } from '@/lib/db';
import { hashPassword, createAuthSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, confirmPassword } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters long' }, { status: 400 });
    }

    if (confirmPassword && password !== confirmPassword) {
      return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
    }

    const existingUser = await findUserByEmail(email.trim());
    if (existingUser) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const newUser = await createUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
      role: 'STUDENT',
      status: 'ACTIVE',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
    });

    // Automatically create session
    const token = await createAuthSession(newUser.id);

    await recordAuditLog({
      userId: newUser.id,
      userName: newUser.name,
      action: 'REGISTER',
      resource: 'User',
      resourceId: newUser.id,
      metadata: { email: newUser.email },
    });

    const { passwordHash: _, ...safeUser } = newUser;
    return NextResponse.json({ message: 'Registration successful', user: safeUser, token }, { status: 201 });
  } catch (err: any) {
    console.error('Registration error:', err);
    return NextResponse.json({ error: 'An unexpected error occurred during registration' }, { status: 500 });
  }
}
