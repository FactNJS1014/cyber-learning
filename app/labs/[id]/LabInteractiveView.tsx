'use client';

import React, { useState } from 'react';
import { SecurityLab } from '@/types';
import TerminalSandbox from '@/components/TerminalSandbox';
import { CheckCircle2, Terminal, BookOpen, Target, Sparkles, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  lab: SecurityLab;
  initialIsCompleted: boolean;
}

export default function LabInteractiveView({ lab, initialIsCompleted }: Props) {
  const [isCompleted, setIsCompleted] = useState(initialIsCompleted);
  const [activeTab, setActiveTab] = useState<'terminal' | 'instructions' | 'solution'>('terminal');
  const [completing, setCompleting] = useState(false);

  const handleMarkComplete = async () => {
    try {
      setCompleting(true);
      const res = await fetch(`/api/labs/${lab.id}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: 'Completed via sandbox terminal execution.' }),
      });

      if (res.ok) {
        setIsCompleted(true);
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#06b6d4', '#10b981', '#f59e0b'],
          });
        } catch (e) {}
      }
    } catch (err) {
      console.error('Failed to complete lab:', err);
    } finally {
      setCompleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Lab Header Card */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 space-y-4 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
              SANDBOX SIMULATOR
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {lab.title}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {isCompleted && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono">
                <CheckCircle2 className="h-4 w-4" />
                Lab Verified
              </span>
            )}
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
          {lab.description || lab.objective}
        </p>

        {/* Target & Objectives */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
            <span className="text-cyan-400 font-bold uppercase">Target System: </span>
            <span className="text-slate-300">{lab.environmentTarget || lab.environment}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
            <span className="text-emerald-400 font-bold uppercase">Objective: </span>
            <span className="text-slate-300 line-clamp-1">{lab.objective}</span>
          </div>
        </div>
      </div>

      {/* Main Sandbox & Guidance 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Terminal Sandbox Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white font-mono">Interactive Container Terminal</h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Isolated Linux Shell</span>
          </div>

          <TerminalSandbox
            labId={lab.id}
            initialCommands={lab.terminalCommands}
            isCompleted={isCompleted}
            onComplete={handleMarkComplete}
          />
        </div>

        {/* Guided Steps Column */}
        <div className="space-y-4">
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-4 backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-white">
              <BookOpen className="h-4 w-4 text-amber-400" />
              <span>Step-by-Step Lab Protocol</span>
            </div>

            {lab.steps && lab.steps.length > 0 ? (
              <div className="space-y-3">
                {lab.steps.map((step, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-cyan-500/20 text-[10px] font-mono font-bold text-cyan-300">
                        {idx + 1}
                      </span>
                      <h4 className="text-xs font-bold text-white">{step.title}</h4>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{step.instruction}</p>
                    {step.hint && (
                      <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20 text-[10px] font-mono text-amber-300">
                        💡 Hint: {step.hint}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                <p className="text-xs text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">
                  {lab.stepByStep}
                </p>
              </div>
            )}

            {(lab.solutionGuide || lab.mitigation) && (
              <div className="pt-2 border-t border-slate-800">
                <details className="text-xs font-mono text-slate-400">
                  <summary className="cursor-pointer text-cyan-400 font-bold hover:text-cyan-300 py-1">
                    ▶ View Defensive Hardening & Mitigation Guide
                  </summary>
                  <pre className="mt-2 p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {lab.solutionGuide || lab.mitigation}
                  </pre>
                </details>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
