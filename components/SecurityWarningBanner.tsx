import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

interface SecurityWarningBannerProps {
  compact?: boolean;
}

export default function SecurityWarningBanner({ compact = false }: SecurityWarningBannerProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
        <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
        <span>
          <strong className="text-amber-200">AUTHORIZED LAB ONLY:</strong> ใช้ Security Testing เฉพาะระบบที่คุณเป็นเจ้าของหรือได้รับอนุญาตให้ทดสอบเท่านั้น
        </span>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/20 p-4 shadow-lg backdrop-blur-sm">
      <div className="flex items-start gap-3.5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
              ⚠ ETHICAL SECURITY ENGAGEMENT MANDATE
            </span>
            <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-amber-300">
              LEGAL & SAFETY COMPLIANCE
            </span>
          </div>
          <p className="text-sm font-medium text-amber-200">
            ใช้ Security Testing เฉพาะระบบที่คุณเป็นเจ้าของหรือได้รับอนุญาตให้ทดสอบเท่านั้น
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">
            All penetration testing, enumeration, and vulnerability analysis workflows in this platform are strictly confined to isolated local sandboxes, Docker test containers, OWASP Juice Shop, and authorized target environments.
          </p>
        </div>
      </div>
    </div>
  );
}
