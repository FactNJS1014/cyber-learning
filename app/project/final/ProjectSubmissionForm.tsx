'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileCheck,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  Award,
  ExternalLink,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { ProjectSubmission } from '@/types';
import confetti from 'canvas-confetti';

interface Props {
  projectId: string;
  initialSubmission?: ProjectSubmission | null;
}

export default function ProjectSubmissionForm({ projectId, initialSubmission }: Props) {
  const [submission, setSubmission] = useState<ProjectSubmission | null>(initialSubmission || null);
  const [title, setTitle] = useState(
    initialSubmission?.title || 'Security Assessment & Hardening Report - Target Sandbox'
  );
  const [testingScope, setTestingScope] = useState(
    initialSubmission?.testingScope ||
      'Authorized Sandbox Network: 127.0.0.1 (Ports 22, 80, 443, 3306), OWASP Juice Shop Container v15.2'
  );
  const [methodology, setMethodology] = useState(
    initialSubmission?.methodology ||
      'PTES (Penetration Testing Execution Standard) & NIST SP 800-115: 1. Passive/Active Reconnaissance -> 2. Vulnerability Discovery -> 3. Proof of Concept Exploitation -> 4. Remediation'
  );
  const [findings, setFindings] = useState(
    initialSubmission?.findings ||
      '1. SQL Injection on login endpoint (/api/auth/login) - CVSS 8.5 (High)\n2. Cross-Site Scripting (Reflected XSS) in search query - CVSS 6.1 (Medium)\n3. Missing Strict-Transport-Security (HSTS) & HttpOnly Cookie Flags - CVSS 5.3 (Medium)'
  );
  const [recommendations, setRecommendations] = useState(
    initialSubmission?.recommendations ||
      '1. Implement Parameterized Queries / ORM prepared statements\n2. Enforce output encoding with DOMPurify and strict CSP headers\n3. Configure SameSite=Lax, HttpOnly, and Secure cookie attributes across all session handlers'
  );
  const [reportUrl, setReportUrl] = useState(initialSubmission?.reportUrl || 'https://example.com/reports/capstone-audit.pdf');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const res = await fetch('/api/projects/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          title,
          testingScope,
          methodology,
          findings,
          recommendations,
          reportUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Submission failed');
      }

      setSubmission(data.submission);
      setSuccessMessage(data.message);

      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch (e) {}
    } catch (err: any) {
      setError(err.message || 'An error occurred during submission');
    } finally {
      setLoading(false);
    }
  };

  // If submission exists and graded
  if (submission && submission.status === 'GRADED') {
    const passed = (submission.score || 0) >= 70;
    return (
      <div className="rounded-2xl border border-emerald-500/40 bg-slate-900/90 p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                GRADED: {submission.score} / 100 PTS
              </span>
              <span className="text-xs font-mono text-slate-400">
                {passed ? '✓ PASSED (≥70%)' : '✕ REVISE REQUIRED'}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white">{submission.title}</h2>
          </div>

          {passed && (
            <Link
              href="/certificate"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all"
            >
              <Award className="h-4 w-4" />
              Claim Certificate
            </Link>
          )}
        </div>

        {/* Feedback Box */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
            Instructor Evaluation & Feedback:
          </span>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            {submission.feedback || 'Outstanding demonstration of security testing and defensive remediation.'}
          </p>
        </div>

        {/* Score Breakdown if present */}
        {submission.scoreBreakdown && Object.keys(submission.scoreBreakdown).length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            {Object.entries(submission.scoreBreakdown).map(([key, val]) => (
              <div key={key} className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 uppercase text-[10px]">{key}</span>
                <p className="text-sm font-bold text-emerald-400">{val} pts</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-md">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <FileCheck className="h-5 w-5 text-cyan-400" />
          Capstone Assessment Submission Portal
        </h2>
        <p className="text-xs text-slate-400">
          Submit your security analysis report. All findings must strictly target authorized sandbox scopes.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
          <span>{successMessage}</span>
        </div>
      )}

      {submission?.status === 'PENDING' && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2.5 font-mono">
          <Clock className="h-4 w-4 shrink-0 text-amber-400" />
          <span>
            Your report has been submitted and is currently queued for evaluation. (Status: PENDING).
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Project Assessment Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">
            Authorized Testing Scope (20 Pts)
          </label>
          <textarea
            rows={2}
            required
            value={testingScope}
            onChange={(e) => setTestingScope(e.target.value)}
            placeholder="Define authorized targets (e.g. 127.0.0.1, Docker sandbox, OWASP Juice Shop)..."
            className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono leading-relaxed"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">
            Assessment Methodology (30 Pts)
          </label>
          <textarea
            rows={3}
            required
            value={methodology}
            onChange={(e) => setMethodology(e.target.value)}
            placeholder="Document testing phases: Reconnaissance, Discovery, Proof of Concept..."
            className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono leading-relaxed"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">
            Discovered Vulnerabilities & Proof of Concept (30 Pts)
          </label>
          <textarea
            rows={4}
            required
            value={findings}
            onChange={(e) => setFindings(e.target.value)}
            placeholder="List CVEs, OWASP Top 10 categories, CVSS scores, and reproduction steps..."
            className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono leading-relaxed"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">
            Remediation & Hardening Recommendations (20 Pts)
          </label>
          <textarea
            rows={3}
            required
            value={recommendations}
            onChange={(e) => setRecommendations(e.target.value)}
            placeholder="Technical code fixes, patch strategies, header configurations..."
            className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono leading-relaxed"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">
            Executive Report URL / Attachment Reference
          </label>
          <input
            type="url"
            value={reportUrl}
            onChange={(e) => setReportUrl(e.target.value)}
            placeholder="https://example.com/reports/audit-report.pdf"
            className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] disabled:opacity-50"
          >
            {loading ? (
              'Submitting Report...'
            ) : (
              <>
                <Send className="h-4 w-4" />
                Submit Capstone Security Assessment
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
