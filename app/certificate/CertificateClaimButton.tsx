'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Award, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CertificateClaimButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleClaim = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/certificates/generate', { method: 'POST' });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Failed to issue certificate');
        return;
      }

      try {
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.5 },
          colors: ['#06b6d4', '#10b981', '#a855f7', '#f59e0b'],
        });
      } catch (e) {}

      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Error generating certificate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClaim}
      disabled={loading}
      className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all disabled:opacity-50"
    >
      <Award className="h-4 w-4" />
      {loading ? 'Issuing Official Credential...' : 'Generate Official Certificate'}
    </button>
  );
}
