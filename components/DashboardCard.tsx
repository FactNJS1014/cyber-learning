import React from 'react';
import { LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: 'cyan' | 'emerald' | 'amber' | 'blue' | 'purple' | 'red';
  trend?: string;
  badge?: string;
  className?: string;
  id?: string;
}

export default function DashboardCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'cyan',
  trend,
  badge,
  className = '',
  id,
}: DashboardCardProps) {
  const colorMap = {
    cyan: {
      border: 'border-cyan-500/20 hover:border-cyan-500/40',
      iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
      glow: 'group-hover:shadow-[0_0_25px_rgba(6,182,212,0.1)]',
    },
    emerald: {
      border: 'border-emerald-500/20 hover:border-emerald-500/40',
      iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      glow: 'group-hover:shadow-[0_0_25px_rgba(16,185,129,0.1)]',
    },
    amber: {
      border: 'border-amber-500/20 hover:border-amber-500/40',
      iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      glow: 'group-hover:shadow-[0_0_25px_rgba(245,158,11,0.1)]',
    },
    blue: {
      border: 'border-blue-500/20 hover:border-blue-500/40',
      iconBg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      glow: 'group-hover:shadow-[0_0_25px_rgba(59,130,246,0.1)]',
    },
    purple: {
      border: 'border-purple-500/20 hover:border-purple-500/40',
      iconBg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      glow: 'group-hover:shadow-[0_0_25px_rgba(168,85,247,0.1)]',
    },
    red: {
      border: 'border-red-500/20 hover:border-red-500/40',
      iconBg: 'bg-red-500/10 text-red-400 border-red-500/30',
      glow: 'group-hover:shadow-[0_0_25px_rgba(239,68,68,0.1)]',
    },
  };

  const scheme = colorMap[color];

  return (
    <div
      id={id}
      className={`group relative overflow-hidden rounded-xl bg-slate-900/80 border ${scheme.border} p-5 backdrop-blur-sm transition-all duration-300 ${scheme.glow} ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-400 font-mono uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">{value}</h3>
            {badge && (
              <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-slate-300 border border-slate-700">
                {badge}
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
          {trend && <p className="text-[11px] font-mono text-cyan-400">{trend}</p>}
        </div>

        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${scheme.iconBg} transition-transform duration-300 group-hover:scale-110`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
