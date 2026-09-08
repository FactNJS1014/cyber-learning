import { cookies, headers } from 'next/headers';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { User, Role } from '@/types';
import {
  findUserByEmail,
  findUserById,
  createSession,
  findSessionByToken,
  deleteSessionByToken,
  recordAuditLog,
} from './db';

export const SESSION_COOKIE_NAME = 'cybersec_session';
export const SESSION_EXPIRATION_HOURS = 24;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export async function createAuthSession(userId: string): Promise<string> {
  const sessionToken = generateSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_EXPIRATION_HOURS * 60 * 60 * 1000);

  await createSession(userId, sessionToken, expiresAt);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    expires: expiresAt,
    maxAge: SESSION_EXPIRATION_HOURS * 60 * 60,
  });

  return sessionToken;
}

export async function clearAuthSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    await deleteSessionByToken(token);
  }

  cookieStore.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    expires: new Date(0),
    maxAge: 0,
  });
}

export async function getCurrentUser(): Promise<Omit<User, 'passwordHash'> | null> {
  try {
    const cookieStore = await cookies();
    let token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!token) {
      try {
        const headerList = await headers();
        const authHeader = headerList.get('authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
          token = authHeader.split('Bearer ')[1].trim();
        }
        if (!token) {
          token = headerList.get('x-session-token') || undefined;
        }
      } catch {
        // headers() might not be available in some edge runtimes
      }
    }

    if (!token) return null;

    const sessionData = await findSessionByToken(token);
    if (!sessionData || !sessionData.user) {
      return null;
    }

    const { passwordHash, ...safeUser } = sessionData.user;
    return safeUser;
  } catch (err) {
    console.error('Error in getCurrentUser:', err);
    return null;
  }
}

export async function requireAuth(): Promise<Omit<User, 'passwordHash'>> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('UNAUTHORIZED');
  }
  return user;
}

export async function requireAdmin(): Promise<Omit<User, 'passwordHash'>> {
  const user = await requireAuth();
  if (user.role !== 'ADMIN') {
    throw new Error('FORBIDDEN');
  }
  return user;
}
