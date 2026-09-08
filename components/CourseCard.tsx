import React from 'react';
import Link from 'next/link';
import { Course, Lesson } from '@/types';
import { Shield, BookOpen, Clock, ChevronRight, CheckCircle2 } from 'lucide-react';
import ProgressBar from './ProgressBar';

interface CourseCardProps {
  course: Course & { lessons?: Lesson[] };
  completedLessonCount?: number;
  id?: string;
}

export default function CourseCard({ course, completedLessonCount = 0, id }: CourseCardProps) {
  const totalLessons = course.lessons?.length || 0;
  const progressPct = totalLessons > 0 ? Math.round((completedLessonCount / totalLessons) * 100) : 0;

  const getLevelBadge = (levelId: string) => {
    switch (levelId) {
      case 'lvl-1':
        return { label: 'BASIC', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
      case 'lvl-2':
        return { label: 'INTERMEDIATE', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' };
      case 'lvl-3':
        return { label: 'ADVANCED', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' };
      default:
        return { label: 'SECURITY', color: 'bg-slate-800 text-slate-300 border-slate-700' };
    }
  };

  const badge = getLevelBadge(course.levelId);

  return (
    <div
      id={id}
      className="group relative flex flex-col justify-between rounded-xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 p-5 transition-all duration-300 hover:shadow-[0_0_25px_rgba(6,182,212,0.12)] backdrop-blur-sm"
    >
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase border ${badge.color}`}>
            {badge.label}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
            <BookOpen className="h-3.5 w-3.5 text-slate-400" />
            <span>{totalLessons} Modules</span>
          </div>
        </div>

        <div>
          <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
            {course.title}
          </h3>
          <p className="mt-1.5 text-xs text-slate-400 leading-relaxed line-clamp-2">
            {course.description}
          </p>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-800/80 space-y-3">
        <ProgressBar
          value={progressPct}
          size="sm"
          color={course.levelId === 'lvl-1' ? 'emerald' : course.levelId === 'lvl-2' ? 'cyan' : 'purple'}
          sublabel={`${completedLessonCount}/${totalLessons} Completed`}
        />

        <Link
          href={`/courses#${course.slug}`}
          className="flex items-center justify-between w-full pt-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <span>Explore Course Syllabus</span>
          <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
