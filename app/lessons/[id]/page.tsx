import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  Shield,
  BookOpen,
  HelpCircle,
  Terminal,
  CheckCircle2,
  Clock,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Lock,
  ArrowRight,
  FileText
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import SecurityWarningBanner from '@/components/SecurityWarningBanner';
import { getCurrentUser } from '@/lib/auth';
import { getLessonById, getNote, getDb } from '@/lib/db';
import LessonClientInteractions from './LessonClientInteractions';

export default async function LessonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();

  // If not logged in, block access and display prompt
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
        <Navbar user={null} />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-5 shadow-2xl backdrop-blur-md">
            <div className="h-16 w-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto shadow-[0_0_20px_rgba(6,182,212,0.2)]">
              <Lock className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white">Authentication Required</h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                กรุณาสมัครสมาชิกหรือเข้าสู่ระบบก่อนเริ่มเรียนหลักสูตรความมั่นคงปลอดภัยทางไซเบอร์
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Link
                href="/login"
                className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors border border-slate-700"
              >
                เข้าสู่ระบบ (Sign In)
              </Link>
              <Link
                href="/register"
                className="py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
              >
                สมัครสมาชิก (Register)
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const lesson = await getLessonById(id);
  if (!lesson) {
    redirect('/courses');
  }

  const db = getDb();
  const progress = db.lessonProgress.find((p) => p.userId === user.id && p.lessonId === lesson.id);
  const isBookmarked = db.bookmarks.some((b) => b.userId === user.id && b.lessonId === lesson.id);
  const note = await getNote(user.id, lesson.id);

  // Sibling lessons for navigation
  const siblingLessons = db.lessons
    .filter((l) => l.courseId === lesson.courseId)
    .sort((a, b) => a.order - b.order);

  const currentIndex = siblingLessons.findIndex((l) => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? siblingLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < siblingLessons.length - 1 ? siblingLessons[currentIndex + 1] : null;

  // Quiz passing status
  const quiz = db.quizzes.find((q) => q.lessonId === lesson.id);
  const quizAttempt = quiz
    ? db.quizAttempts
        .filter((a) => a.userId === user.id && a.quizId === quiz.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
    : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      <Navbar user={user as any} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <SecurityWarningBanner compact />

        {/* Back Link & Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/courses"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Curriculum
          </Link>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 uppercase">
              {lesson.level}
            </span>
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {lesson.durationMinutes} mins
            </span>
          </div>
        </div>

        {/* 2-Column Layout: Main Content (Col 1) + Course Sidebar / Notes (Col 2) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Lesson Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Lesson Title & Objectives */}
            <div className="space-y-4 rounded-2xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 backdrop-blur-md">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {lesson.title}
              </h1>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  🎯 Learning Objective:
                </span>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {lesson.learningObjective}
                </p>
              </div>

              {/* Action Strip */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
                <div className="flex items-center gap-3">
                  <Link
                    href={`/lessons/${lesson.id}/quiz`}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all"
                  >
                    <HelpCircle className="h-4 w-4" />
                    Take 20-Q Quiz
                    {quizAttempt?.passed && (
                      <span className="ml-1 px-1.5 py-0.5 rounded bg-slate-950 text-emerald-400 text-[10px]">
                        ✓ {quizAttempt.percentage}%
                      </span>
                    )}
                  </Link>

                  {lesson.labContent && (
                    <Link
                      href="/labs"
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold text-xs transition-colors"
                    >
                      <Terminal className="h-4 w-4 text-amber-400" />
                      Open Sandbox Lab
                    </Link>
                  )}
                </div>

                <LessonClientInteractions
                  lessonId={lesson.id}
                  initialIsBookmarked={isBookmarked}
                  initialNote={note?.content || ''}
                />
              </div>
            </div>

            {/* Markdown Body Content */}
            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 sm:p-8 space-y-6">
              <div className="prose prose-invert max-w-none prose-headings:text-cyan-300 prose-headings:font-mono prose-p:text-slate-300 prose-p:leading-relaxed prose-pre:bg-slate-950 prose-pre:border prose-pre:border-slate-800 prose-code:text-cyan-400 prose-li:text-slate-300">
                <div className="whitespace-pre-wrap font-sans text-sm sm:text-base leading-relaxed space-y-4">
                  {lesson.content}
                </div>
              </div>

              {/* Lab Walkthrough Box if present */}
              {lesson.labContent && (
                <div className="mt-8 p-6 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-3 font-mono">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase">
                    <Terminal className="h-4 w-4" />
                    Hands-on Lab Guidance
                  </div>
                  <pre className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {lesson.labContent}
                  </pre>
                </div>
              )}
            </div>

            {/* Bottom Lesson Navigation */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-800">
              {prevLesson ? (
                <Link
                  href={`/lessons/${prevLesson.id}`}
                  className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white"
                >
                  <ChevronLeft className="h-4 w-4 text-cyan-400" />
                  <span>
                    Previous: <span className="text-cyan-400">{prevLesson.title}</span>
                  </span>
                </Link>
              ) : (
                <div />
              )}

              {nextLesson ? (
                <Link
                  href={`/lessons/${nextLesson.id}`}
                  className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white"
                >
                  <span>
                    Next: <span className="text-cyan-400">{nextLesson.title}</span>
                  </span>
                  <ChevronRight className="h-4 w-4 text-cyan-400" />
                </Link>
              ) : (
                <Link
                  href="/project/final"
                  className="flex items-center gap-2 text-xs font-bold text-purple-400 hover:text-purple-300"
                >
                  <span>Proceed to Final Project</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          </div>

          {/* Sidebar: Course Outline & Progress */}
          <div className="space-y-6">
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-4 sticky top-20 backdrop-blur-md">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                  Course Modules
                </span>
                <h3 className="text-sm font-bold text-white line-clamp-1">{lesson.course?.title}</h3>
              </div>

              <div className="space-y-1.5">
                {siblingLessons.map((sib, idx) => {
                  const isCurrent = sib.id === lesson.id;
                  const isDone = db.lessonProgress.some(
                    (p) => p.userId === user.id && p.lessonId === sib.id && p.isCompleted
                  );

                  return (
                    <Link
                      key={sib.id}
                      href={`/lessons/${sib.id}`}
                      className={`flex items-start gap-2.5 p-2.5 rounded-xl text-xs transition-all ${
                        isCurrent
                          ? 'bg-cyan-500/15 border border-cyan-400 text-white font-semibold shadow-[0_0_10px_rgba(6,182,212,0.15)]'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {isDone ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                        ) : (
                          <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-slate-800 text-[9px] font-mono text-slate-400">
                            {idx + 1}
                          </span>
                        )}
                      </div>
                      <span className="line-clamp-2 leading-relaxed">{sib.title}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
