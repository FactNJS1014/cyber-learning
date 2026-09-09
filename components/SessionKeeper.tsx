'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export const SESSION_COOKIE_NAME = 'cybersec_session';

export function syncClientSession() {
  if (typeof window === 'undefined') return;
  try {
    const token = localStorage.getItem('cybersec_session_token');
    if (token) {
      // Ensure the cookie is present for server component requests
      const cookieExists = document.cookie
        .split(';')
        .some((item) => item.trim().startsWith(`${SESSION_COOKIE_NAME}=`));

      if (!cookieExists || !document.cookie.includes(`${SESSION_COOKIE_NAME}=${token}`)) {
        document.cookie = `${SESSION_COOKIE_NAME}=${token}; path=/; max-age=86400; SameSite=Lax`;
      }
    }
  } catch {
    // Ignore storage/cookie access errors
  }
}

export default function SessionKeeper() {
  const pathname = usePathname();

  useEffect(() => {
    syncClientSession();
  }, [pathname]);

  return null;
}
