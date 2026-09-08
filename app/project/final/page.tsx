import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  Shield,
  FileCheck,
  CheckCircle2,
  Lock,
  Award,
  AlertTriangle,
  ChevronRight,
  Send,
  Clock,
  Sparkles
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import SecurityWarningBanner from '@/components/SecurityWarningBanner';
import { getCurrentUser } from '@/lib/auth';
import { getFinalProject, getUserProgress, getDb } from '@/lib/db';
import ProjectSubmissionForm from './ProjectSubmissionForm';

export default async function FinalProjectPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const project = await getFinalProject();
  const progress = await getUserProgress(user.id);
  const db = getDb();
  const existingSubmission = db.projectSubmissions.find((s) => s.userId === user.id);

  const isUnlocked = progress.finalProject.isUnlocked;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      <Navbar user={user as any} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <SecurityWarningBanner />

        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-purple-400 font-mono text-xs font-semibold uppercase tracking-wider">
            <Award className="h-4 w-4" />
            <span>Capstone Certification Requirement</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Final Security Project: Vulnerability Assessment & Hardening Audit
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
            Demonstrate your end-to-end practical mastery by performing an authorized security assessment, documenting discovered vulnerabilities, and presenting concrete architectural remediations.
          </p>
        </div>

        {/* Prerequisite Check Banner */}
        {!isUnlocked ? (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
                <Lock className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Final Project Currently Locked</h3>
                <p className="text-xs sm:text-sm text-slate-400">
                  You must complete all syllabus modules across Basic, Intermediate, and Advanced tiers and pass all 20-question evaluation quizzes (≥70%) to unlock submission.
                </p>
              </div>
            </div>

            {/* Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300 font-semibold">1. Basic Tier</span>
                  <span className="text-emerald-400 font-bold">{progress.levels.basic.percentage}%</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle2
                    className={`h-4 w-4 ${
                      progress.levels.basic.percentage === 100 ? 'text-emerald-400' : 'text-slate-600'
                    }`}
                  />
                  <span className="text-slate-400">
                    {progress.levels.basic.percentage === 100 ? 'Completed' : 'In Progress'}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300 font-semibold">2. Intermediate Tier</span>
                  <span className="text-cyan-400 font-bold">{progress.levels.intermediate.percentage}%</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle2
                    className={`h-4 w-4 ${
                      progress.levels.intermediate.percentage === 100 ? 'text-emerald-400' : 'text-slate-600'
                    }`}
                  />
                  <span className="text-slate-400">
                    {progress.levels.intermediate.percentage === 100 ? 'Completed' : 'In Progress'}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300 font-semibold">3. Advanced Tier</span>
                  <span className="text-purple-400 font-bold">{progress.levels.advanced.percentage}%</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle2
                    className={`h-4 w-4 ${
                      progress.levels.advanced.percentage === 100 ? 'text-emerald-400' : 'text-slate-600'
                    }`}
                  />
                  <span className="text-slate-400">
                    {progress.levels.advanced.percentage === 100 ? 'Completed' : 'In Progress'}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
              >
                Resume Coursework to Unlock
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* 100-point Rubric Cards */}
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                    EVALUATION CRITERIA
                  </span>
                  <h2 className="text-xl font-bold text-white">100-Point Grading Rubric</h2>
                </div>
                <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold">
                  Passing Score: ≥70 / 100
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {project.rubric.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{item.category}</span>
                      <span className="text-xs font-mono font-bold text-cyan-400">{item.maxPoints} pts</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Submission Form / Graded Result */}
            <ProjectSubmissionForm
              projectId={project.id}
              initialSubmission={existingSubmission as any}
            />
          </div>
        )}
      </main>
    </div>
  );
}
