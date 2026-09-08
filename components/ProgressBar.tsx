import React from 'react';

interface ProgressBarProps {
  value: number; // 0 to 100
  label?: string;
  sublabel?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'cyan' | 'emerald' | 'amber' | 'blue' | 'purple';
  showPercentage?: boolean;
}

export default function ProgressBar({
  value,
  label,
  sublabel,
  size = 'md',
  color = 'cyan',
  showPercentage = true,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const colorGradients = {
    cyan: 'bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_12px_rgba(6,182,212,0.4)]',
    emerald: 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_12px_rgba(16,185,129,0.4)]',
    amber: 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-[0_0_12px_rgba(245,158,11,0.4)]',
    blue: 'bg-gradient-to-r from-blue-500 to-indigo-500 shadow-[0_0_12px_rgba(59,130,246,0.4)]',
    purple: 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-[0_0_12px_rgba(168,85,247,0.4)]',
  };

  return (
    <div className="w-full space-y-1.5">
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            {label && <span className="font-semibold text-slate-200">{label}</span>}
            {sublabel && <span className="text-[11px] text-slate-400 font-mono">({sublabel})</span>}
          </div>
          {showPercentage && (
            <span className="font-mono font-bold text-slate-300">{clamped}%</span>
          )}
        </div>
      )}

      <div className={`w-full overflow-hidden rounded-full bg-slate-900 border border-slate-800 ${heightClasses[size]}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${colorGradients[color]}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
