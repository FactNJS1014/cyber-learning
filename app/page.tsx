import React from 'react';
import Link from 'next/link';
import {
  Shield,
  BookOpen,
  Terminal,
  Award,
  Lock,
  FileCheck,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Zap,
  Users,
  Server
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import SecurityWarningBanner from '@/components/SecurityWarningBanner';
import { getCurrentUser } from '@/lib/auth';
import { getLevels, getCourses, getAllLessons, getAllLabs } from '@/lib/db';

export default async function HomePage() {
  const user = await getCurrentUser();
  const levels = await getLevels();
  const courses = await getCourses();
  const lessons = await getAllLessons();
  const labs = await getAllLabs();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      <Navbar user={user as any} />

      <main className="flex-1">
        {/* Security Policy Alert */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <SecurityWarningBanner compact />
        </div>

        {/* Hero Section */}
        <section className="relative overflow-hidden py-16 sm:py-24 border-b border-slate-900">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              <span>Full-Stack Cybersecurity Mastery Platform</span>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Master Cyber Security from{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500">
                  Basic to Advanced
                </span>
              </h1>
              <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
                Comprehensive training featuring structured theoretical foundations, 20-question certification quizzes, hands-on terminal sandboxes, capstone security project, and verifiable credentials.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href={user ? '/dashboard' : '/register'}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all shadow-[0_0_25px_rgba(6,182,212,0.35)]"
              >
                {user ? 'Go to Student Dashboard' : 'Start Free Training'}
                <ChevronRight className="h-4 w-4" />
              </Link>
              <Link
                href="/courses"
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm border border-slate-800 transition-colors"
              >
                <BookOpen className="h-4 w-4 text-slate-400" />
                Browse Curriculum
              </Link>
            </div>

            {/* Key Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-10">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
                <p className="text-2xl font-bold text-white font-mono">{levels.length} Levels</p>
                <p className="text-xs text-slate-400 mt-1">Basic → Advanced</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
                <p className="text-2xl font-bold text-cyan-400 font-mono">{lessons.length} Modules</p>
                <p className="text-xs text-slate-400 mt-1">In-depth Lessons</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
                <p className="text-2xl font-bold text-emerald-400 font-mono">20 Qs / Quiz</p>
                <p className="text-xs text-slate-400 mt-1">70% Passing Benchmark</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
                <p className="text-2xl font-bold text-purple-400 font-mono">{labs.length} Labs</p>
                <p className="text-xs text-slate-400 mt-1">Interactive Sandboxes</p>
              </div>
            </div>
          </div>
        </section>

        {/* 3-Tier Curriculum Levels */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
              LEARNING PATHWAY
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Progressive Three-Tier Security Curriculum
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              Each level introduces rigorous real-world attack vectors, defense mechanisms, and compliance frameworks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Level 1: Basic */}
            <div className="rounded-2xl bg-slate-900/80 border border-emerald-500/30 p-6 flex flex-col justify-between hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] transition-all">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    LEVEL 1: BASIC
                  </span>
                  <Shield className="h-5 w-5 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Fundamentals & Network Defense</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  CIA Triad, Authentication, TCP/IP, OSI Model, Port Scanning with Nmap, Firewalls, and Password Security.
                </p>
                <ul className="space-y-2 text-xs text-slate-300 font-mono">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    Security Concepts & Principles
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    Network Security & Port Scanning
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    Password & Access Control
                  </li>
                </ul>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-800">
                <Link
                  href="/courses?level=basic"
                  className="flex items-center justify-between text-xs font-bold text-emerald-400 hover:text-emerald-300"
                >
                  <span>Explore Basic Modules</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Level 2: Intermediate */}
            <div className="rounded-2xl bg-slate-900/80 border border-cyan-500/30 p-6 flex flex-col justify-between hover:shadow-[0_0_30px_rgba(6,182,212,0.1)] transition-all">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    LEVEL 2: INTERMEDIATE
                  </span>
                  <Lock className="h-5 w-5 text-cyan-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Web Security & Cryptography</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  OWASP Top 10, SQL Injection, XSS, CSRF, Secure Session Management, AES/RSA Encryption, and TLS.
                </p>
                <ul className="space-y-2 text-xs text-slate-300 font-mono">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                    OWASP Web Vulnerabilities
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                    Cryptography & TLS Protocols
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                    Secure Authentication & Cookies
                  </li>
                </ul>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-800">
                <Link
                  href="/courses?level=intermediate"
                  className="flex items-center justify-between text-xs font-bold text-cyan-400 hover:text-cyan-300"
                >
                  <span>Explore Intermediate Modules</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Level 3: Advanced */}
            <div className="rounded-2xl bg-slate-900/80 border border-purple-500/30 p-6 flex flex-col justify-between hover:shadow-[0_0_30px_rgba(168,85,247,0.1)] transition-all">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30">
                    LEVEL 3: ADVANCED
                  </span>
                  <Award className="h-5 w-5 text-purple-400" />
                </div>
                <h3 className="text-lg font-bold text-white">Offensive Security & Incident Response</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Penetration Testing Methodology, Privilege Escalation, Security Auditing, SIEM Logging, and SOC Response.
                </p>
                <ul className="space-y-2 text-xs text-slate-300 font-mono">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                    Penetration Testing Frameworks
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                    Privilege Escalation & Exploit Analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                    SOC Analysis & Incident Response
                  </li>
                </ul>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-800">
                <Link
                  href="/courses?level=advanced"
                  className="flex items-center justify-between text-xs font-bold text-purple-400 hover:text-purple-300"
                >
                  <span>Explore Advanced Modules</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Hands-on Lab & Capstone Project Highlights */}
        <section className="py-16 bg-slate-900/40 border-y border-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
                <Terminal className="h-3.5 w-3.5 text-amber-400" />
                <span>Hands-on Security Sandbox</span>
              </div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                Simulated Interactive Terminal & Final Project Capstone
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Practice real network enumeration, SQL injection detection, and privilege auditing in isolated Docker/localhost sandboxes. Submit your penetration testing capstone report to unlock your official verified certificate.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">20 Questions Per Lesson</h4>
                    <p className="text-xs text-slate-400">Strict server-side scoring requiring ≥70% (14/20) pass rate.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Full Capstone Project Rubric</h4>
                    <p className="text-xs text-slate-400">Graded across 100 points: Scope, Methodology, Analysis, and Remediation.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Verifiable Certificate of Completion</h4>
                    <p className="text-xs text-slate-400">Unique CSL credential number with instant public verification registry.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/labs"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(6,182,212,0.25)]"
                >
                  <Terminal className="h-4 w-4" />
                  Try Sandbox Labs
                </Link>
              </div>
            </div>

            {/* Mock Terminal Card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 font-mono shadow-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs text-slate-400">
                <span className="text-cyan-400">terminal@cybersec-lab:~$</span>
                <span className="text-[10px] text-emerald-400">127.0.0.1 (Sandbox)</span>
              </div>
              <div className="text-xs space-y-2 text-slate-300">
                <p className="text-slate-400">$ nmap -sV -p 22,80,443 127.0.0.1</p>
                <div className="p-3 rounded bg-slate-900/90 text-[11px] text-cyan-300/90 leading-relaxed border border-slate-800/80">
                  PORT &nbsp;&nbsp;&nbsp;STATE SERVICE &nbsp;VERSION<br />
                  22/tcp &nbsp;open &nbsp;ssh &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;OpenSSH 8.9p1<br />
                  80/tcp &nbsp;open &nbsp;http &nbsp;&nbsp;&nbsp;&nbsp;nginx 1.24.0<br />
                  443/tcp open &nbsp;ssl/https nginx 1.24.0 (TLS 1.3)<br />
                  <span className="text-emerald-400">Nmap scan report complete (1 host up).</span>
                </div>
                <p className="text-slate-400">$ test-sqli --target /api/user --payload &quot;&apos; OR 1=1--&quot;</p>
                <div className="p-3 rounded bg-slate-900/90 text-[11px] text-amber-300/90 leading-relaxed border border-slate-800/80">
                  [AUDIT] Prepared Statements Active. Injection Neutralized safely.
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-10 text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-cyan-400" />
            <span className="text-slate-300 font-bold">CyberSec Learning Platform</span>
            <span>— Enterprise-grade Cybersecurity Training</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/courses" className="hover:text-cyan-400 transition-colors">Curriculum</Link>
            <Link href="/labs" className="hover:text-cyan-400 transition-colors">Labs</Link>
            <Link href="/certificate" className="hover:text-cyan-400 transition-colors">Verify Certificate</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
