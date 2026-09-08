import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  Shield,
  Award,
  CheckCircle2,
  Lock,
  ChevronRight,
  ExternalLink,
  Printer,
  Sparkles
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import SecurityWarningBanner from '@/components/SecurityWarningBanner';
import CertificateCard from '@/components/CertificateCard';
import { getCurrentUser } from '@/lib/auth';
import { getUserCertificate, getUserProgress } from '@/lib/db';
import CertificateClaimButton from './CertificateClaimButton';

export default async function CertificatePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const certificate = await getUserCertificate(user.id);
  const progress = await getUserProgress(user.id);

  const isEligible =
    progress.levels.basic.percentage === 100 &&
    progress.levels.intermediate.percentage === 100 &&
    progress.levels.advanced.percentage === 100 &&
    progress.finalProject.submission?.status === 'GRADED' &&
    (progress.finalProject.submission.score || 0) >= 70;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      <Navbar user={user as any} />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <SecurityWarningBanner compact />

        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
            OFFICIAL ACCREDITATION
          </span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Cyber Security Professional Certification
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Verifiable digital credential demonstrating end-to-end competencies across Network Defense, Web Security, Penetration Testing, and Incident Response.
          </p>
        </div>

        {/* Certificate Display if Issued */}
        {certificate ? (
          <CertificateCard
            certificate={certificate}
            studentName={user.name}
          />
        ) : (
          /* Eligibility Checklist & Claim Flow */
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Graduation Prerequisites Audit</h3>
                  <p className="text-xs text-slate-400">
                    Complete all 4 requirements below to generate your official credential.
                  </p>
                </div>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase border ${
                  isEligible
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {isEligible ? 'ELIGIBLE' : 'INCOMPLETE'}
              </span>
            </div>

            {/* Checklist Items */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <div className="flex items-center gap-3">
                  <CheckCircle2
                    className={`h-5 w-5 ${
                      progress.levels.basic.percentage === 100 ? 'text-emerald-400' : 'text-slate-600'
                    }`}
                  />
                  <div>
                    <span className="font-bold text-white">1. Level 1 (Basic) Curriculum & Quizzes</span>
                    <p className="text-[11px] text-slate-400">Complete all foundational lessons with passing quiz scores</p>
                  </div>
                </div>
                <span className="font-mono font-bold text-slate-300">{progress.levels.basic.percentage}%</span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <div className="flex items-center gap-3">
                  <CheckCircle2
                    className={`h-5 w-5 ${
                      progress.levels.intermediate.percentage === 100 ? 'text-cyan-400' : 'text-slate-600'
                    }`}
                  />
                  <div>
                    <span className="font-bold text-white">2. Level 2 (Intermediate) Curriculum & Quizzes</span>
                    <p className="text-[11px] text-slate-400">Master OWASP Top 10, Web Security, Cryptography</p>
                  </div>
                </div>
                <span className="font-mono font-bold text-slate-300">{progress.levels.intermediate.percentage}%</span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <div className="flex items-center gap-3">
                  <CheckCircle2
                    className={`h-5 w-5 ${
                      progress.levels.advanced.percentage === 100 ? 'text-purple-400' : 'text-slate-600'
                    }`}
                  />
                  <div>
                    <span className="font-bold text-white">3. Level 3 (Advanced) Curriculum & Quizzes</span>
                    <p className="text-[11px] text-slate-400">Complete Penetration Testing and Incident Response modules</p>
                  </div>
                </div>
                <span className="font-mono font-bold text-slate-300">{progress.levels.advanced.percentage}%</span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <div className="flex items-center gap-3">
                  <CheckCircle2
                    className={`h-5 w-5 ${
                      progress.finalProject.submission?.status === 'GRADED' &&
                      (progress.finalProject.submission.score || 0) >= 70
                        ? 'text-emerald-400'
                        : 'text-slate-600'
                    }`}
                  />
                  <div>
                    <span className="font-bold text-white">4. Final Security Capstone Project</span>
                    <p className="text-[11px] text-slate-400">Pass the 100-point Capstone assessment with score ≥ 70%</p>
                  </div>
                </div>
                <span className="font-mono font-bold text-slate-300">
                  {progress.finalProject.submission
                    ? `Score: ${progress.finalProject.submission.score ?? 'Pending Review'} / 100`
                    : 'Not Submitted'}
                </span>
              </div>
            </div>

            {/* Claim Action */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              {!isEligible ? (
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Lock className="h-4 w-4 text-amber-400" />
                  <span>Fulfill the outstanding requirements above to generate your credential.</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold font-mono">
                  <Sparkles className="h-4 w-4" />
                  <span>All graduation requirements satisfied!</span>
                </div>
              )}

              {isEligible ? (
                <CertificateClaimButton />
              ) : (
                <Link
                  href="/courses"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                >
                  Continue Coursework
                  <ChevronRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
