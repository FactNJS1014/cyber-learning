import React from 'react';
import Link from 'next/link';
import { Lesson } from '@/types';
import { BookOpen, CheckCircle2, Clock, HelpCircle, Terminal, ChevronRight } from 'lucide-react';

interface LessonCardProps {
  lesson: Lesson & { isCompleted?: boolean; isBookmarked?: boolean };
  id?: string;
}

export default function LessonCard({ lesson, id }: LessonCardProps) {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'BASIC':
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
    <div
      id={id}
      className={`group relative flex flex-col justify-between rounded-xl bg-slate-900/60 border ${
        lesson.isCompleted ? 'border-emerald-500/30 bg-emerald-950/10' : 'border-slate-800 hover:border-slate-700'
      } p-4 transition-all duration-200 hover:shadow-lg backdrop-blur-sm`}
    >
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${getLevelColor(lesson.level)}`}>
            {lesson.level}
          </span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
              <Clock className="h-3 w-3 text-slate-400" />
              {lesson.durationMinutes}m
            </span>
            {lesson.isCompleted && (
              <span className="flex items-center gap-1 text-[11px] font-mono font-semibold text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Done
              </span>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
            {lesson.title}
          </h4>
          <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {lesson.description}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1 text-cyan-400/80">
            <HelpCircle className="h-3 w-3" />
            20-Q Quiz
          </span>
          {lesson.labContent && (
            <span className="flex items-center gap-1 text-amber-400/80">
              <Terminal className="h-3 w-3" />
              Lab
            </span>
          )}
        </div>

        <Link
          href={`/lessons/${lesson.id}`}
          className="flex items-center gap-1 text-xs font-semibold text-cyan-400 group-hover:text-cyan-300 transition-colors"
        >
          {lesson.isCompleted ? 'Review' : 'Start Lesson'}
          <ChevronRight className="h-3.5 w-3.5 transform group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
