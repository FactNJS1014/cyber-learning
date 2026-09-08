import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  Shield,
  Terminal,
  ChevronLeft,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  AlertTriangle,
  Flame
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import SecurityWarningBanner from '@/components/SecurityWarningBanner';
import { getCurrentUser } from '@/lib/auth';
import { getLabById, getDb } from '@/lib/db';
import LabInteractiveView from './LabInteractiveView';

export default async function SingleLabPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const lab = await getLabById(id);
  if (!lab) {
    redirect('/labs');
  }

  const db = getDb();
  const progress = db.labProgress.find((p) => p.userId === user.id && p.labId === lab.id);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      <Navbar user={user as any} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <SecurityWarningBanner />

        {/* Back Link */}
        <div className="flex items-center justify-between">
          <Link
            href="/labs"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Security Labs
          </Link>

          <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
            <span className="text-amber-400 font-bold">{lab.difficulty}</span>
            <span>•</span>
            <span>Est. {lab.estimatedMinutes} mins</span>
          </div>
        </div>

        {/* Interactive Lab View */}
        <LabInteractiveView
          lab={lab}
          initialIsCompleted={progress?.isCompleted || false}
        />
      </main>
    </div>
  );
}
