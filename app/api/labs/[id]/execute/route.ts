import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { getLabById } from '@/lib/db';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await requireAuth();
    const { command } = await req.json();

    if (!command || typeof command !== 'string') {
      return NextResponse.json({ error: 'Command string is required' }, { status: 400 });
    }

    const lab = await getLabById(id);
    const cmd = command.trim();

    // Check pre-configured terminal commands on lab
    const matchingCmd = lab?.terminalCommands?.find(
      (c) => c.command.toLowerCase().trim() === cmd.toLowerCase()
    );

    if (matchingCmd) {
      return NextResponse.json({
        output: matchingCmd.output,
        hint: matchingCmd.hint,
        status: 0,
      });
    }

    // Dynamic safe sandbox execution responses
    let output = '';
    const lower = cmd.toLowerCase();

    if (lower === 'help' || lower === '?') {
      output = `Available Sandbox Commands:
  - nmap [options] 127.0.0.1
  - test-sqli [--mode vulnerable|prepared] --input "..."
  - intercept-http --target /api/session
  - apply-security-headers --cookie-flags "..."
  - curl -I https://localhost:3000
  - openssl x509 -in cert.pem -text -noout
  - ls -la /var/log
  - cat /var/log/auth.log
  - chmod 600 id_rsa
  - whoami
  - clear`;
    } else if (lower.startsWith('nmap')) {
      if (lower.includes('127.0.0.1') || lower.includes('localhost')) {
        output = `Starting Nmap 7.94 ( https://nmap.org ) at 2026-09-08 09:05 UTC
Nmap scan report for localhost (127.0.0.1)
Host is up (0.00018s latency).
PORT     STATE SERVICE  VERSION
22/tcp   open  ssh      OpenSSH 8.9p1 Ubuntu
80/tcp   open  http     nginx 1.24.0
443/tcp  open  https    nginx 1.24.0 (TLS 1.3)
3306/tcp open  mysql    MySQL 8.0.35 (Localhost only)

Nmap done: 1 IP address (1 host up) scanned in 0.38 seconds`;
      } else {
        output = `[SECURITY NOTICE]: Sandbox policy strictly restricts target scanning to local sandboxes (127.0.0.1 / localhost). External target blocked.`;
      }
    } else if (lower.startsWith('curl -i') || lower.startsWith('curl -v')) {
      output = `HTTP/1.1 200 OK
Date: Tue, 08 Sep 2026 09:06:00 GMT
Server: CyberSec-Engine/2.4
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Content-Security-Policy: default-src 'self'
Set-Cookie: session=sec_token_98412; Path=/; HttpOnly; Secure; SameSite=Strict`;
    } else if (lower.startsWith('ls')) {
      output = `drwxr-xr-x 2 root root 4096 Sep 08 09:00 .
drwxr-xr-x 4 root root 4096 Sep 08 08:50 ..
-rw-r--r-- 1 root root  512 Sep 08 09:00 auth.log
-rw-r--r-- 1 root root 1024 Sep 08 09:01 syslog
-rw------- 1 root root 1675 Sep 08 08:55 id_rsa`;
    } else if (lower.startsWith('cat /var/log/auth.log') || lower.startsWith('cat auth.log')) {
      output = `Sep  8 08:59:12 sec-node sshd[1402]: Failed password for invalid user admin from 127.0.0.1 port 54812 ssh2
Sep  8 08:59:15 sec-node sshd[1402]: Failed password for invalid user admin from 127.0.0.1 port 54812 ssh2
Sep  8 08:59:18 sec-node sshd[1402]: Failed password for invalid user admin from 127.0.0.1 port 54812 ssh2
Sep  8 08:59:20 sec-node sshd[1402]: Maximum authentication attempts exceeded for invalid user admin from 127.0.0.1 port 54812 ssh2 [preauth]`;
    } else if (lower.startsWith('whoami')) {
      output = `security-student@sandbox-environment`;
    } else if (lower.startsWith('chmod')) {
      output = `Permissions updated successfully for target resource in local sandbox.`;
    } else {
      output = `Command '${cmd}' executed in sandbox environment. (Type 'help' to see recommended commands for this lab).`;
    }

    return NextResponse.json({
      output,
      status: 0,
    });
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
