import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  Shield,
  BookOpen,
  Terminal,
  Award,
  CheckCircle2,
  Clock,
  ChevronRight,
  Sparkles,
  Bookmark,
  FileCheck,
  AlertTriangle,
  Flame,
  TrendingUp,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import SecurityWarningBanner from '@/components/SecurityWarningBanner';
import DashboardCard from '@/components/DashboardCard';
import ProgressBar from '@/components/ProgressBar';
import { getCurrentUser } from '@/lib/auth';
import { getUserProgress, getCourses, getAllLessons, getUserBookmarks, getDb } from '@/lib/db';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const progress = await getUserProgress(user.id);
  const courses = await getCourses();
  const allLessons = await getAllLessons();
  const bookmarks = await getUserBookmarks(user.id);
  const db = getDb();

  // Find next uncompleted lesson
  const completedLessonIds = new Set(
    db.lessonProgress.filter((p) => p.userId === user.id && p.isCompleted).map((p) => p.lessonId)
  );
  const nextLesson = allLessons.find((l) => !completedLessonIds.has(l.id)) || allLessons[0];

  // User's recent quiz attempts
  const recentAttempts = db.quizAttempts
    .filter((a) => a.userId === user.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const completedLabsCount = db.labProgress.filter((l) => l.userId === user.id && l.isCompleted).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      <Navbar user={user as any} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Security Warning */}
        <SecurityWarningBanner compact />

        {/* Welcome Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 p-6 sm:p-8 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-semibold uppercase tracking-wider">
                <Shield className="h-4 w-4" />
                <span>Security Training Dashboard</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Welcome back, {user.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
                Continue your progress through Basic, Intermediate, and Advanced cybersecurity domains. Complete all module quizzes (≥70%) to qualify for the Capstone Project and Certificate.
              </p>
            </div>

            {/* Overall Graduation Progress */}
            <div className="sm:w-64 p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 font-semibold">GRADUATION PROGRESS</span>
                <span className="text-cyan-400 font-bold">{progress.overallPercentage}%</span>
              </div>
              <ProgressBar value={progress.overallPercentage} size="md" color="cyan" showPercentage={false} />
              <p className="text-[11px] font-mono text-slate-400 text-right">
                {progress.completedLessonsCount}/{progress.totalLessonsCount} Lessons Done
              </p>
            </div>
          </div>
        </div>

        {/* KPI Metrics Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardCard
            title="Lessons Completed"
            value={`${progress.completedLessonsCount} / ${progress.totalLessonsCount}`}
            subtitle={`${progress.overallPercentage}% Total Progress`}
            icon={BookOpen}
            color="cyan"
          />
          <DashboardCard
            title="Quizzes Passed (≥70%)"
            value={`${progress.quizStats.passedCount} / ${progress.quizStats.totalQuizzes}`}
            subtitle="20 Questions Per Quiz"
            icon={CheckCircle2}
            color="emerald"
          />
          <DashboardCard
            title="Hands-on Labs"
            value={`${completedLabsCount} / ${db.labs.length}`}
            subtitle="Terminal Sandboxes"
            icon={Terminal}
            color="amber"
          />
          <DashboardCard
            title="Certificate Status"
            value={progress.certificate ? 'ISSUED' : progress.finalProject.isUnlocked ? 'READY' : 'LOCKED'}
            subtitle={progress.certificate ? 'CSL Credential Active' : 'Prerequisites Required'}
            icon={Award}
            color={progress.certificate ? 'emerald' : progress.finalProject.isUnlocked ? 'cyan' : 'purple'}
          />
        </div>

        {/* Level Progression Hierarchy */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-cyan-400" />
              Progressive Tier Breakdown
            </h2>
            <Link href="/courses" className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1">
              View All Modules <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Basic Level */}
            <div className="rounded-xl bg-slate-900/80 border border-emerald-500/20 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase">
                  LEVEL 1: BASIC
                </span>
                <span className="text-xs font-mono font-bold text-slate-300">
                  {progress.levels.basic.percentage}%
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Fundamentals & Network Defense</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  CIA Triad, OSI Model, Port Scanning, Password Policies.
                </p>
              </div>
              <ProgressBar
                value={progress.levels.basic.percentage}
                size="sm"
                color="emerald"
                sublabel={`${progress.levels.basic.completed}/${progress.levels.basic.total} Complete`}
              />
              <Link
                href="/courses?level=basic"
                className="block text-center py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30 transition-colors"
              >
                Go to Basic Modules
              </Link>
            </div>

            {/* Intermediate Level */}
            <div className="rounded-xl bg-slate-900/80 border border-cyan-500/20 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 uppercase">
                  LEVEL 2: INTERMEDIATE
                </span>
                <span className="text-xs font-mono font-bold text-slate-300">
                  {progress.levels.intermediate.percentage}%
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Web Security & Cryptography</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  OWASP Top 10, SQLi, XSS, TLS, Secure Cookies.
                </p>
              </div>
              <ProgressBar
                value={progress.levels.intermediate.percentage}
                size="sm"
                color="cyan"
                sublabel={`${progress.levels.intermediate.completed}/${progress.levels.intermediate.total} Complete`}
              />
              <Link
                href="/courses?level=intermediate"
                className="block text-center py-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-semibold border border-cyan-500/30 transition-colors"
              >
                Go to Intermediate Modules
              </Link>
            </div>

            {/* Advanced Level */}
            <div className="rounded-xl bg-slate-900/80 border border-purple-500/20 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30 uppercase">
                  LEVEL 3: ADVANCED
                </span>
                <span className="text-xs font-mono font-bold text-slate-300">
                  {progress.levels.advanced.percentage}%
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Offensive Security & Incident Response</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  Penetration Testing, Privilege Escalation, SIEM Logging, SOC Analysis.
                </p>
              </div>
              <ProgressBar
                value={progress.levels.advanced.percentage}
                size="sm"
                color="purple"
                sublabel={`${progress.levels.advanced.completed}/${progress.levels.advanced.total} Complete`}
              />
              <Link
                href="/courses?level=advanced"
                className="block text-center py-2 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/30 transition-colors"
              >
                Go to Advanced Modules
              </Link>
            </div>
          </div>
        </div>

        {/* 2-Column Split: Next Up & Capstone Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Next Lesson Box */}
          <div className="lg:col-span-2 rounded-2xl bg-slate-900/90 border border-slate-800 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                RECOMMENDED NEXT MODULE
              </span>
              <span className="text-xs font-mono text-slate-400">
                Est. {nextLesson.durationMinutes} mins
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg sm:text-xl font-bold text-white">{nextLesson.title}</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {nextLesson.description}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs space-y-1">
              <span className="text-cyan-400 font-mono font-bold">🎯 Learning Objective:</span>
              <p className="text-slate-300">{nextLesson.learningObjective}</p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1 text-cyan-400">
                  <HelpCircle className="h-3.5 w-3.5" />
                  20-Question Quiz
                </span>
                {nextLesson.labContent && (
                  <span className="flex items-center gap-1 text-amber-400">
                    <Terminal className="h-3.5 w-3.5" />
                    Interactive Lab
                  </span>
                )}
              </div>

              <Link
                href={`/lessons/${nextLesson.id}`}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all"
              >
                Launch Lesson
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Capstone Project & Certificate Unlock Card */}
          <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950/30 border border-purple-500/30 p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/40 text-purple-400">
                  <Award className="h-5 w-5" />
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                    progress.finalProject.isUnlocked
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {progress.finalProject.isUnlocked ? 'UNLOCKED' : 'LOCKED'}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white">Final Security Project</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Submit your simulated penetration testing capstone report to be graded on the 100-point rubric.
                </p>
              </div>

              <div className="space-y-1.5 text-[11px] font-mono text-slate-400 border-t border-slate-800 pt-3">
                <p className="text-slate-300 font-bold mb-1">Prerequisites Checklist:</p>
                <div className="flex items-center gap-2">
                  <CheckCircle2
                    className={`h-3.5 w-3.5 ${
                      progress.levels.basic.percentage === 100 ? 'text-emerald-400' : 'text-slate-600'
                    }`}
                  />
                  <span>Basic Level: {progress.levels.basic.percentage}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2
                    className={`h-3.5 w-3.5 ${
                      progress.levels.intermediate.percentage === 100 ? 'text-emerald-400' : 'text-slate-600'
                    }`}
                  />
                  <span>Intermediate Level: {progress.levels.intermediate.percentage}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2
                    className={`h-3.5 w-3.5 ${
                      progress.levels.advanced.percentage === 100 ? 'text-emerald-400' : 'text-slate-600'
                    }`}
                  />
                  <span>Advanced Level: {progress.levels.advanced.percentage}%</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/project/final"
                className="w-full block text-center py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)]"
              >
                View Capstone Project
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Quiz Scores & Bookmarks Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Quiz Attempts */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-4">
            <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-cyan-400" />
              Recent 20-Q Quiz Submissions
            </h3>

            {recentAttempts.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center font-mono">
                No quiz attempts yet. Complete a lesson to take its 20-question evaluation!
              </p>
            ) : (
              <div className="space-y-2.5">
                {recentAttempts.map((attempt) => (
                  <div
                    key={attempt.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs font-mono"
                  >
                    <div className="space-y-0.5">
                      <span className="font-semibold text-slate-200">
                        Score: {attempt.score} / {attempt.totalQuestions} ({attempt.percentage}%)
                      </span>
                      <p className="text-[10px] text-slate-500">
                        {new Date(attempt.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        attempt.passed
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-red-500/20 text-red-300 border border-red-500/40'
                      }`}
                    >
                      {attempt.passed ? 'PASSED (≥70%)' : 'FAILED (<70%)'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bookmarked Lessons */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-4">
            <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
              <Bookmark className="h-4 w-4 text-amber-400" />
              Bookmarked Modules
            </h3>

            {bookmarks.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center font-mono">
                No bookmarked lessons yet. Click the bookmark icon inside any lesson to save it for review.
              </p>
            ) : (
              <div className="space-y-2.5">
                {bookmarks.map((lesson) => (
                  <Link
                    key={lesson.id}
                    href={`/lessons/${lesson.id}`}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800/80 text-xs transition-colors group"
                  >
                    <div className="space-y-0.5">
                      <p className="font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors">
                        {lesson.title}
                      </p>
                      <span className="text-[10px] font-mono text-slate-400">{lesson.level}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
