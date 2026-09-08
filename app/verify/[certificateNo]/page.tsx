import React from 'react';
import Link from 'next/link';
import { Shield, Award, CheckCircle2, XCircle, ExternalLink, QrCode } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { getCertificateByNo } from '@/lib/db';

export default async function CertificateVerificationPage({
  params,
}: {
  params: Promise<{ certificateNo: string }>;
}) {
  const { certificateNo } = await params;
  const cert = await getCertificateByNo(certificateNo);

  const formattedDate = cert
    ? new Date(cert.issuedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      <Navbar user={null} />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-12 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
            <Shield className="h-3.5 w-3.5 text-cyan-400" />
            <span>Official Credential Registry</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Certificate Public Verification
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Verifying registry record for credential: <strong className="text-cyan-400">{certificateNo}</strong>
          </p>
        </div>

        {cert ? (
          /* Valid Certificate Result */
          <div className="rounded-3xl border border-emerald-500/40 bg-slate-900/90 p-8 sm:p-10 shadow-[0_0_50px_rgba(16,185,129,0.15)] space-y-6 text-center backdrop-blur-md">
            <div className="flex flex-col items-center space-y-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-400">
                <CheckCircle2 className="h-9 w-9" />
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold uppercase">
                AUTHENTIC & VERIFIED CREDENTIAL
              </span>
            </div>

            <div className="border-t border-b border-slate-800 py-6 space-y-4">
              <div>
                <span className="text-xs font-mono text-slate-500 uppercase">Credential Holder</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                  {cert.userName || cert.user?.name || 'Verified Student'}
                </h2>
              </div>

              <div>
                <span className="text-xs font-mono text-slate-500 uppercase">Program Certified</span>
                <p className="text-base font-semibold text-cyan-300 mt-0.5">{cert.programName}</p>
                <p className="text-xs font-mono text-slate-400 mt-1">Level: {cert.level}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 text-[10px] uppercase">Certificate ID</span>
                <p className="font-bold text-slate-200 mt-0.5">{cert.certificateNo}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 text-[10px] uppercase">Date Issued</span>
                <p className="font-semibold text-slate-200 mt-0.5">{formattedDate}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 text-[10px] uppercase">Verification Hash</span>
                <p className="font-bold text-cyan-400 mt-0.5">{cert.verificationCode}</p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/courses"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300"
              >
                Learn more about CyberSec Academy programs →
              </Link>
            </div>
          </div>
        ) : (
          /* Invalid / Not Found */
          <div className="rounded-3xl border border-red-500/40 bg-slate-900/90 p-8 sm:p-10 shadow-2xl space-y-6 text-center">
            <div className="flex flex-col items-center space-y-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/20 border border-red-500/50 text-red-400">
                <XCircle className="h-9 w-9" />
              </div>
              <h2 className="text-xl font-bold text-white">Certificate Not Found</h2>
              <p className="text-xs text-slate-400 max-w-md">
                No active credential matching registration number <strong className="text-red-300 font-mono">{certificateNo}</strong> was located in our public database.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-200 hover:bg-slate-700"
              >
                Return to Academy Home
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
