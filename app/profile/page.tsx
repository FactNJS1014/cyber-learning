import React from 'react';
import { redirect } from 'next/navigation';
import {
  Shield,
  User as UserIcon,
  Award,
  Key,
  Lock,
  CheckCircle2,
  Sparkles,
  Bookmark,
  Terminal
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import SecurityWarningBanner from '@/components/SecurityWarningBanner';
import { getCurrentUser } from '@/lib/auth';
import { getUserAchievements, getUserProgress, getDb } from '@/lib/db';
import ProfileSettingsClient from './ProfileSettingsClient';

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const achievements = await getUserAchievements(user.id);
  const progress = await getUserProgress(user.id);
  const db = getDb();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      <Navbar user={user as any} />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <SecurityWarningBanner compact />

        {/* User Identity Header */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="h-20 w-20 rounded-2xl bg-cyan-950 border-2 border-cyan-500/40 flex items-center justify-center text-cyan-300 text-2xl font-bold overflow-hidden shadow-[0_0_25px_rgba(6,182,212,0.25)] shrink-0">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                user.name.charAt(0)
              )}
            </div>

            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  {user.role}
                </span>
                <span className="px-2.5 py-0.5 rounded text-xs font-mono text-slate-400 bg-slate-800 border border-slate-700">
                  {user.status}
                </span>
              </div>
              <p className="text-xs font-mono text-slate-400">{user.email}</p>
              {user.bio && <p className="text-xs text-slate-300 mt-2 max-w-2xl">{user.bio}</p>}
            </div>
          </div>
        </div>

        {/* Achievement Badges */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                SECURITY ACCOLADES
              </span>
              <h2 className="text-lg font-bold text-white">Earned Mastery Badges</h2>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {achievements.length} Badges Unlocked
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-center flex flex-col items-center"
              >
                <div className="text-2xl">{ach.icon}</div>
                <h4 className="text-xs font-bold text-white">{ach.title}</h4>
                <p className="text-[11px] text-slate-400 leading-tight">{ach.description}</p>
                <span className="text-[10px] font-mono text-slate-500 mt-auto pt-2">
                  {ach.unlockedAt ? new Date(ach.unlockedAt).toLocaleDateString() : 'Active'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Client Profile Settings & Password Form */}
        <ProfileSettingsClient user={user as any} />
      </main>
    </div>
  );
}
