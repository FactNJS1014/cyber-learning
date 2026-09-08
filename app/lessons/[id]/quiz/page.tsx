import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Shield, ChevronLeft, HelpCircle, AlertTriangle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import SecurityWarningBanner from '@/components/SecurityWarningBanner';
import QuizPlayer from '@/components/QuizPlayer';
import { getCurrentUser } from '@/lib/auth';
import { getLessonById, getDb } from '@/lib/db';

export default async function LessonQuizPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const lesson = await getLessonById(id);
  if (!lesson) {
    redirect('/courses');
  }

  const db = getDb();
  const quiz = db.quizzes.find((q) => q.lessonId === lesson.id) || {
    id: `quiz-${lesson.id}`,
    title: `Evaluation Quiz: ${lesson.title}`,
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      <Navbar user={user as any} />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <SecurityWarningBanner compact />

        {/* Back Link */}
        <div className="flex items-center justify-between">
          <Link
            href={`/lessons/${lesson.id}`}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Lesson: {lesson.title}
          </Link>

          <span className="text-xs font-mono text-cyan-400 font-bold">
            20 Questions Evaluation (≥70% to Pass)
          </span>
        </div>

        {/* Mount Quiz Engine */}
        <QuizPlayer
          quizId={quiz.id}
          lessonId={lesson.id}
          lessonTitle={lesson.title}
        />
      </main>
    </div>
  );
}
