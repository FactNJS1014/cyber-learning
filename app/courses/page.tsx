import React from 'react';
import Link from 'next/link';
import {
  Shield,
  BookOpen,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Terminal,
  HelpCircle,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import SecurityWarningBanner from '@/components/SecurityWarningBanner';
import LessonCard from '@/components/LessonCard';
import { getCurrentUser } from '@/lib/auth';
import { getLevels, getCourses, getAllLessons, getDb } from '@/lib/db';

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ level?: string; q?: string }>;
}) {
  const { level, q } = await searchParams;
  const user = await getCurrentUser();
  const levels = await getLevels();
  const courses = await getCourses();
  const db = getDb();

  let lessons = await getAllLessons();

  if (level) {
    lessons = lessons.filter((l) => l.level.toLowerCase() === level.toLowerCase());
  }

  if (q) {
    const query = q.toLowerCase();
    lessons = lessons.filter(
      (l) =>
        l.title.toLowerCase().includes(query) ||
        l.description.toLowerCase().includes(query) ||
        l.learningObjective.toLowerCase().includes(query)
    );
  }

  // Attach progress if logged in
  const userCompletedSet = new Set(
    user ? db.lessonProgress.filter((p) => p.userId === user.id && p.isCompleted).map((p) => p.lessonId) : []
  );
  const userBookmarkSet = new Set(
    user ? db.bookmarks.filter((b) => b.userId === user.id).map((b) => b.lessonId) : []
  );

  const enrichedLessons = lessons.map((l) => ({
    ...l,
    isCompleted: userCompletedSet.has(l.id),
    isBookmarked: userBookmarkSet.has(l.id),
  }));

  const levelTabs = [
    { key: '', label: 'All Modules' },
    { key: 'basic', label: 'Basic (Level 1)' },
    { key: 'intermediate', label: 'Intermediate (Level 2)' },
    { key: 'advanced', label: 'Advanced (Level 3)' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      <Navbar user={user as any} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <SecurityWarningBanner compact />

        {/* Page Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-semibold uppercase tracking-wider">
            <BookOpen className="h-4 w-4" />
            <span>Structured Security Curriculum</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Cybersecurity Knowledge Modules
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            Progress step-by-step through our curated training syllabus. Every module includes deep technical content, practical lab assignments, and a mandatory 20-question evaluation (≥70% required).
          </p>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
          {/* Level Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {levelTabs.map((tab) => {
              const isActive = (level || '') === tab.key;
              return (
                <Link
                  key={tab.key}
                  href={`/courses?${new URLSearchParams({
                    ...(tab.key ? { level: tab.key } : {}),
                    ...(q ? { q } : {}),
                  }).toString()}`}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>

          {/* Search Form */}
          <form className="relative sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              name="q"
              defaultValue={q || ''}
              placeholder="Filter topics, CVEs, tools..."
              className="w-full h-9 pl-9 pr-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 font-mono"
            />
            {level && <input type="hidden" name="level" value={level} />}
          </form>
        </div>

        {/* Lessons Grid grouped by courses or listed */}
        {enrichedLessons.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
            <Search className="h-10 w-10 text-slate-500 mx-auto" />
            <h3 className="text-base font-bold text-white">No modules match your query</h3>
            <p className="text-xs text-slate-400">Try adjusting your keyword filter or level selection.</p>
            <Link
              href="/courses"
              className="inline-block mt-2 px-4 py-2 rounded-lg bg-slate-800 text-xs font-semibold text-slate-200 hover:bg-slate-700"
            >
              Reset Filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {enrichedLessons.map((lesson) => (
              <LessonCard key={lesson.id} lesson={lesson} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
