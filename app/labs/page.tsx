import React from 'react';
import Link from 'next/link';
import {
  Shield,
  Terminal,
  CheckCircle2,
  Clock,
  ChevronRight,
  AlertTriangle,
  Play,
  Flame,
  Layers
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import SecurityWarningBanner from '@/components/SecurityWarningBanner';
import { getCurrentUser } from '@/lib/auth';
import { getAllLabs, getLabProgress, getDb } from '@/lib/db';

export default async function LabsPage() {
  const user = await getCurrentUser();
  const labs = await getAllLabs();
  const db = getDb();

  const userProgress = user ? await getLabProgress(user.id) : [];
  const completedLabIds = new Set(userProgress.filter((p) => p.isCompleted).map((p) => p.labId));

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'BEGINNER':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'INTERMEDIATE':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
      case 'ADVANCED':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
      default:
        return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      <Navbar user={user as any} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Prominent Warning */}
        <SecurityWarningBanner />

        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-semibold uppercase tracking-wider">
            <Terminal className="h-4 w-4" />
            <span>Isolated Sandbox Environments</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Hands-on Security Sandbox Labs
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            Execute safe vulnerability analysis, packet capture analysis, parameter fuzzing, and defensive hardening configurations inside our simulated Docker/localhost containers.
          </p>
        </div>

        {/* Labs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {labs.map((lab) => {
            const isCompleted = completedLabIds.has(lab.id);
            return (
              <div
                key={lab.id}
                className={`flex flex-col justify-between rounded-2xl bg-slate-900/80 border ${
                  isCompleted ? 'border-emerald-500/30 bg-emerald-950/10' : 'border-slate-800 hover:border-cyan-500/40'
                } p-6 transition-all duration-300 hover:shadow-[0_0_25px_rgba(6,182,212,0.12)] backdrop-blur-sm`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${getDifficultyColor(lab.difficulty || 'INTERMEDIATE')}`}>
                      {lab.difficulty || 'INTERMEDIATE'}
                    </span>
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                      <Clock className="h-3.5 w-3.5" />
                      {lab.estimatedMinutes || 30}m
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {lab.title}
                    </h3>
                    <p className="mt-1.5 text-xs text-slate-400 leading-relaxed line-clamp-3">
                      {lab.description || lab.objective}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs font-mono space-y-1">
                    <span className="text-[11px] text-amber-400 font-bold uppercase">Target: </span>
                    <span className="text-slate-300">{lab.environmentTarget || lab.environment}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="text-xs font-mono">
                    {isCompleted ? (
                      <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                        <CheckCircle2 className="h-4 w-4" />
                        Completed
                      </span>
                    ) : (
                      <span className="text-slate-500">Not Completed</span>
                    )}
                  </div>

                  <Link
                    href={`/labs/${lab.id}`}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                  >
                    <Play className="h-3.5 w-3.5" />
                    {isCompleted ? 'Re-open Lab' : 'Launch Sandbox'}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
