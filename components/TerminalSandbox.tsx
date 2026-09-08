'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Play, RotateCcw, CheckCircle2, Copy, Check, Sparkles } from 'lucide-react';

interface TerminalSandboxProps {
  labId: string;
  initialCommands?: { command: string; output: string; hint?: string }[];
  isCompleted?: boolean;
  onComplete?: () => void;
}

export default function TerminalSandbox({
  labId,
  initialCommands = [],
  isCompleted = false,
  onComplete,
}: TerminalSandboxProps) {
  const [history, setHistory] = useState<Array<{ command: string; output: string; timestamp: string }>>([
    {
      command: 'sys-init',
      output: `[SYSTEM OK] Sandbox Container v4.2 Initialized (Isolated Local Environment)
Target Host: 127.0.0.1 (Localhost / Sandbox VLAN)
Type 'help' or click sample command chips below to begin.`,
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [commandHistoryList, setCommandHistoryList] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [executing, setExecuting] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const executeCommand = async (cmdString: string) => {
    const trimmed = cmdString.trim();
    if (!trimmed) return;

    if (trimmed.toLowerCase() === 'clear') {
      setHistory([]);
      setInputVal('');
      return;
    }

    setExecuting(true);
    setCommandHistoryList((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    try {
      const res = await fetch(`/api/labs/${labId}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: trimmed }),
      });

      const data = await res.json();
      setHistory((prev) => [
        ...prev,
        {
          command: trimmed,
          output: data.output || 'No output returned.',
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } catch (err: any) {
      setHistory((prev) => [
        ...prev,
        {
          command: trimmed,
          output: `[ERROR] Execution failed: ${err.message}`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setExecuting(false);
      setInputVal('');
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistoryList.length === 0) return;
      const nextIndex = historyIndex === -1 ? commandHistoryList.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInputVal(commandHistoryList[nextIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= commandHistoryList.length) {
        setHistoryIndex(-1);
        setInputVal('');
      } else {
        setHistoryIndex(nextIndex);
        setInputVal(commandHistoryList[nextIndex]);
      }
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="flex flex-col rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl font-mono">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/90 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500/80" />
            <div className="h-3 w-3 rounded-full bg-amber-500/80" />
            <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="ml-2 text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <TerminalIcon className="h-3.5 w-3.5 text-cyan-400" />
            sandbox-node-01: /lab/workspace
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setHistory([])}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800/60 hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            Clear
          </button>
        </div>
      </div>

      {/* Recommended Lab Command Chips */}
      {initialCommands.length > 0 && (
        <div className="flex items-center gap-2 p-2.5 bg-slate-900/40 border-b border-slate-800/60 overflow-x-auto text-xs">
          <span className="text-[10px] text-cyan-400 font-bold uppercase shrink-0 flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            Quick Run:
          </span>
          {initialCommands.map((item, idx) => (
            <button
              key={idx}
              onClick={() => executeCommand(item.command)}
              className="px-2.5 py-1 rounded bg-slate-900 hover:bg-cyan-950 text-cyan-300 border border-slate-800 hover:border-cyan-500/40 text-[11px] shrink-0 transition-colors"
            >
              $ {item.command}
            </button>
          ))}
        </div>
      )}

      {/* Terminal Screen Body */}
      <div className="p-4 sm:p-5 h-96 overflow-y-auto space-y-4 text-xs bg-slate-950/90 leading-relaxed">
        {history.map((entry, idx) => (
          <div key={idx} className="space-y-1.5">
            <div className="flex items-center justify-between text-slate-400">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">student@cybersec-lab</span>
                <span className="text-slate-500">:</span>
                <span className="text-cyan-400">~/workspace</span>
                <span className="text-slate-300">$</span>
                <span className="text-white font-semibold">{entry.command}</span>
              </div>
              <button
                onClick={() => handleCopy(entry.output, idx)}
                className="text-slate-600 hover:text-slate-300 transition-colors"
                title="Copy output"
              >
                {copiedIndex === idx ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
            <pre className="p-3 rounded-lg bg-slate-900/80 border border-slate-800/80 text-slate-200 whitespace-pre-wrap font-mono text-[11px] leading-relaxed">
              {entry.output}
            </pre>
          </div>
        ))}

        {executing && (
          <div className="flex items-center gap-2 text-cyan-400 text-xs animate-pulse">
            <div className="h-2 w-2 rounded-full bg-cyan-400" />
            <span>Executing command in isolated sandbox environment...</span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Terminal Command Input Prompt */}
      <div className="flex items-center gap-2 border-t border-slate-800 bg-slate-900/90 px-4 py-3">
        <span className="text-emerald-400 font-bold text-xs shrink-0">student@lab:~$</span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={executing}
          placeholder="Type sandbox command (e.g. nmap 127.0.0.1, help)..."
          className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
        />
        <button
          onClick={() => executeCommand(inputVal)}
          disabled={executing || !inputVal.trim()}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs disabled:opacity-40 transition-all shrink-0"
        >
          <Play className="h-3 w-3" />
          Run
        </button>
      </div>

      {/* Bottom Completion Bar */}
      <div className="flex items-center justify-between border-t border-slate-800/80 bg-slate-950 px-4 py-3">
        <span className="text-[11px] text-slate-400">
          Target: <span className="text-emerald-400 font-bold">127.0.0.1 (Docker Sandbox)</span>
        </span>

        {onComplete && (
          <button
            onClick={onComplete}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isCompleted
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            {isCompleted ? 'Lab Completed ✓' : 'Mark Lab Complete'}
          </button>
        )}
      </div>
    </div>
  );
}
