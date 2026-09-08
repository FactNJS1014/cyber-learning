'use client';

import React, { useState } from 'react';
import {
  Users,
  BookOpen,
  FileCheck,
  Award,
  Activity,
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Shield,
  Filter,
  Check,
  ExternalLink
} from 'lucide-react';
import DashboardCard from '@/components/DashboardCard';
import ProgressBar from '@/components/ProgressBar';

interface Props {
  initialAnalytics: any;
  initialUsers: any[];
  initialLessons: any[];
  initialSubmissions: any[];
  initialLogs: any[];
  courses: any[];
  adminId: string;
}

export default function AdminDashboardClient({
  initialAnalytics,
  initialUsers,
  initialLessons,
  initialSubmissions,
  initialLogs,
  courses,
  adminId,
}: Props) {
  const [activeTab, setActiveTab] = useState<'analytics' | 'users' | 'lessons' | 'projects' | 'audit'>('analytics');

  // States
  const [users, setUsers] = useState(initialUsers);
  const [userQuery, setUserQuery] = useState('');
  const [lessons, setLessons] = useState(initialLessons);
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [logs, setLogs] = useState(initialLogs);

  // Modals / Selected Items
  const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null);
  const [gradeScore, setGradeScore] = useState('88');
  const [gradeFeedback, setGradeFeedback] = useState('Excellent scoping and thorough defensive remediation advice.');
  const [isGrading, setIsGrading] = useState(false);

  // Lesson Edit State
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<any | null>(null);
  const [lessonForm, setLessonForm] = useState({
    title: '',
    slug: '',
    courseId: courses[0]?.id || 'crs-1',
    level: 'BASIC',
    description: '',
    learningObjective: '',
    content: '',
    labContent: '',
    order: 1,
    durationMinutes: 30,
    status: 'PUBLISHED',
  });
  const [lessonError, setLessonError] = useState<string | null>(null);

  // User Actions
  const handleUpdateUser = async (userId: string, updates: any) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...updates }),
      });
      if (res.ok) {
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, ...updates } : u)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this user?')) return;
    try {
      const res = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Grade Project
  const handleGradeProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission) return;

    try {
      setIsGrading(true);
      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId: selectedSubmission.id,
          score: Number(gradeScore),
          feedback: gradeFeedback,
          scoreBreakdown: {
            scope: Math.min(20, Math.round(Number(gradeScore) * 0.2)),
            methodology: Math.min(30, Math.round(Number(gradeScore) * 0.3)),
            findings: Math.min(30, Math.round(Number(gradeScore) * 0.3)),
            remediation: Math.min(20, Math.round(Number(gradeScore) * 0.2)),
          },
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSubmissions((prev) =>
          prev.map((s) => (s.id === selectedSubmission.id ? data.submission : s))
        );
        setSelectedSubmission(null);
      } else {
        alert(data.error || 'Grading failed');
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsGrading(false);
    }
  };

  // Save Lesson
  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    setLessonError(null);

    const isEdit = !!editingLesson;
    const url = '/api/admin/lessons';
    const method = isEdit ? 'PUT' : 'POST';
    const payload = isEdit ? { id: editingLesson.id, ...lessonForm } : lessonForm;

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setLessonError(data.message || data.error || 'Failed to save lesson');
        return;
      }

      if (isEdit) {
        setLessons((prev) =>
          prev.map((l) => (l.id === editingLesson.id ? { ...l, ...data.lesson } : l))
        );
      } else {
        setLessons((prev) => [...prev, data.lesson]);
      }

      setIsLessonModalOpen(false);
      setEditingLesson(null);
    } catch (err: any) {
      setLessonError(err.message);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(userQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(userQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 overflow-x-auto">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all whitespace-nowrap ${
            activeTab === 'analytics'
              ? 'bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Activity className="h-3.5 w-3.5" />
          Analytics & Metrics
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all whitespace-nowrap ${
            activeTab === 'users'
              ? 'bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="h-3.5 w-3.5" />
          User Authorizations ({users.length})
        </button>

        <button
          onClick={() => setActiveTab('lessons')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all whitespace-nowrap ${
            activeTab === 'lessons'
              ? 'bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="h-3.5 w-3.5" />
          Lesson CMS ({lessons.length})
        </button>

        <button
          onClick={() => setActiveTab('projects')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all whitespace-nowrap ${
            activeTab === 'projects'
              ? 'bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileCheck className="h-3.5 w-3.5" />
          Capstone Grading ({submissions.length})
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all whitespace-nowrap ${
            activeTab === 'audit'
              ? 'bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Shield className="h-3.5 w-3.5" />
          Security Audit Trail
        </button>
      </div>

      {/* ================= TAB 1: ANALYTICS ================= */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <DashboardCard
              title="Registered Students"
              value={initialAnalytics.totalStudents}
              subtitle="Active Learners"
              icon={Users}
              color="cyan"
            />
            <DashboardCard
              title="Published Lessons"
              value={initialAnalytics.publishedLessons}
              subtitle="20-Q Quiz Verified"
              icon={BookOpen}
              color="emerald"
            />
            <DashboardCard
              title="Quiz Pass Rate (≥70%)"
              value={`${initialAnalytics.quizPassRate}%`}
              subtitle="Across All Attempts"
              icon={CheckCircle2}
              color="amber"
            />
            <DashboardCard
              title="Certificates Issued"
              value={initialAnalytics.issuedCertificates}
              subtitle="Verified Graduates"
              icon={Award}
              color="purple"
            />
          </div>

          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 space-y-4">
            <h3 className="text-sm font-bold text-white font-mono">Platform Health & Compliance</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              All learning tracks operate in strict adherence with isolated sandbox security policies. All lesson evaluations mandate a 20-question comprehensive assessment before publishing.
            </p>
          </div>
        </div>
      )}

      {/* ================= TAB 2: USER MANAGEMENT ================= */}
      {activeTab === 'users' && (
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative sm:w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
            <span className="text-xs font-mono text-slate-400">
              Showing {filteredUsers.length} of {users.length} accounts
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="border-b border-slate-800 text-slate-400 uppercase">
                <tr>
                  <th className="py-3 px-3">User</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Progress</th>
                  <th className="py-3 px-3">Certificate</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-950/40 transition-colors">
                    <td className="py-3 px-3">
                      <div>
                        <span className="font-bold text-white font-sans">{u.name}</span>
                        <p className="text-[11px] text-slate-500">{u.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <select
                        value={u.role}
                        onChange={(e) => handleUpdateUser(u.id, { role: e.target.value })}
                        disabled={u.id === adminId}
                        className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 focus:outline-none focus:border-amber-500"
                      >
                        <option value="STUDENT">STUDENT</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                    <td className="py-3 px-3">
                      <select
                        value={u.status}
                        onChange={(e) => handleUpdateUser(u.id, { status: e.target.value })}
                        disabled={u.id === adminId}
                        className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 focus:outline-none focus:border-amber-500"
                      >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="SUSPENDED">SUSPENDED</option>
                      </select>
                    </td>
                    <td className="py-3 px-3 text-slate-300">
                      {u.completedLessonsCount} Lessons
                    </td>
                    <td className="py-3 px-3">
                      {u.hasCertificate ? (
                        <span className="text-emerald-400 font-bold">✓ ISSUED</span>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      {u.id !== adminId && (
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 3: LESSON CMS ================= */}
      {activeTab === 'lessons' && (
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-white font-mono">Curriculum Management</h3>
              <p className="text-xs text-slate-400">
                Rule: Lessons must contain exactly 20 quiz questions before publishing.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingLesson(null);
                setLessonForm({
                  title: '',
                  slug: '',
                  courseId: courses[0]?.id || 'crs-1',
                  level: 'BASIC',
                  description: '',
                  learningObjective: '',
                  content: '',
                  labContent: '',
                  order: lessons.length + 1,
                  durationMinutes: 30,
                  status: 'DRAFT',
                });
                setIsLessonModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)]"
            >
              <Plus className="h-4 w-4" />
              Add New Lesson
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="border-b border-slate-800 text-slate-400 uppercase">
                <tr>
                  <th className="py-3 px-3">Lesson Title</th>
                  <th className="py-3 px-3">Level</th>
                  <th className="py-3 px-3">20-Q Quiz Status</th>
                  <th className="py-3 px-3">Publish Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {lessons.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-950/40 transition-colors">
                    <td className="py-3 px-3">
                      <div>
                        <span className="font-bold text-white font-sans">{l.title}</span>
                        <p className="text-[11px] text-slate-500 font-mono">Slug: {l.slug}</p>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-950 border border-slate-800 text-cyan-400">
                        {l.level}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`font-bold ${
                          l.questionCount === 20 ? 'text-emerald-400' : 'text-amber-400'
                        }`}
                      >
                        {l.questionCount} / 20 Questions
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          l.status === 'PUBLISHED'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {l.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right space-x-2">
                      <button
                        onClick={() => {
                          setEditingLesson(l);
                          setLessonForm({
                            title: l.title,
                            slug: l.slug,
                            courseId: l.courseId,
                            level: l.level,
                            description: l.description,
                            learningObjective: l.learningObjective,
                            content: l.content,
                            labContent: l.labContent || '',
                            order: l.order,
                            durationMinutes: l.durationMinutes,
                            status: l.status,
                          });
                          setIsLessonModalOpen(true);
                        }}
                        className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                        title="Edit Lesson"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 4: CAPSTONE GRADING ================= */}
      {activeTab === 'projects' && (
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white font-mono">Capstone Security Project Reviews</h3>
            <p className="text-xs text-slate-400">
              Grade submitted penetration testing and hardening reports across the 100-point rubric.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="border-b border-slate-800 text-slate-400 uppercase">
                <tr>
                  <th className="py-3 px-3">Student / Title</th>
                  <th className="py-3 px-3">Scope</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Score</th>
                  <th className="py-3 px-3 text-right">Review</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-950/40 transition-colors">
                    <td className="py-3 px-3">
                      <div>
                        <span className="font-bold text-white font-sans">{sub.title}</span>
                        <p className="text-[11px] text-slate-500 font-mono">
                          User ID: {sub.userId} • Submitted: {new Date(sub.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-400 max-w-xs truncate">
                      {sub.testingScope}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          sub.status === 'GRADED'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        {sub.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-200">
                      {sub.score !== undefined ? `${sub.score} / 100` : '—'}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedSubmission(sub);
                          setGradeScore(sub.score ? String(sub.score) : '85');
                          setGradeFeedback(sub.feedback || 'Great work on the remediation plan.');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all"
                      >
                        {sub.status === 'GRADED' ? 'Re-Grade' : 'Grade Submission'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 5: AUDIT LOGS ================= */}
      {activeTab === 'audit' && (
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 space-y-4">
          <h3 className="text-sm font-bold text-white font-mono">Real-time Platform Audit Trail</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="border-b border-slate-800 text-slate-400 uppercase">
                <tr>
                  <th className="py-3 px-3">Timestamp</th>
                  <th className="py-3 px-3">Actor</th>
                  <th className="py-3 px-3">Action</th>
                  <th className="py-3 px-3">Target Resource</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-950/40">
                    <td className="py-3 px-3 text-slate-500">{new Date(log.createdAt).toLocaleString()}</td>
                    <td className="py-3 px-3 font-semibold text-slate-300">{log.userName || log.userId}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-cyan-400 font-bold">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400">{log.resource}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= GRADING MODAL ================= */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white font-mono">
                Grade Capstone: {selectedSubmission.title}
              </h3>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Submission Preview */}
            <div className="space-y-3 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono">
              <div>
                <strong className="text-cyan-400">Testing Scope: </strong>
                <p className="text-slate-300">{selectedSubmission.testingScope}</p>
              </div>
              <div>
                <strong className="text-cyan-400">Methodology: </strong>
                <p className="text-slate-300">{selectedSubmission.methodology}</p>
              </div>
              <div>
                <strong className="text-cyan-400">Findings: </strong>
                <p className="text-slate-300 whitespace-pre-wrap">{selectedSubmission.findings}</p>
              </div>
              <div>
                <strong className="text-cyan-400">Recommendations: </strong>
                <p className="text-slate-300 whitespace-pre-wrap">{selectedSubmission.recommendations}</p>
              </div>
            </div>

            {/* Grading Form */}
            <form onSubmit={handleGradeProject} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">Total Score (0 to 100)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  required
                  value={gradeScore}
                  onChange={(e) => setGradeScore(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono text-sm focus:outline-none focus:border-amber-500"
                />
                <span className="text-[10px] text-slate-500 font-mono">Score ≥70 earns Certificate eligibility</span>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">Instructor Feedback & Comments</label>
                <textarea
                  rows={3}
                  value={gradeFeedback}
                  onChange={(e) => setGradeFeedback(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono focus:outline-none focus:border-amber-500 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedSubmission(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGrading}
                  className="px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all disabled:opacity-50"
                >
                  {isGrading ? 'Submitting Grade...' : 'Save & Finalize Grade'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= LESSON EDIT MODAL ================= */}
      {isLessonModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white font-mono">
                {editingLesson ? 'Edit Lesson' : 'Create New Lesson'}
              </h3>
              <button
                onClick={() => setIsLessonModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {lessonError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0 text-red-400" />
                <span>{lessonError}</span>
              </div>
            )}

            <form onSubmit={handleSaveLesson} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Lesson Title</label>
                  <input
                    type="text"
                    required
                    value={lessonForm.title}
                    onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                    className="w-full h-9 px-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">URL Slug</label>
                  <input
                    type="text"
                    required
                    value={lessonForm.slug}
                    onChange={(e) => setLessonForm({ ...lessonForm, slug: e.target.value })}
                    className="w-full h-9 px-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Level</label>
                  <select
                    value={lessonForm.level}
                    onChange={(e) => setLessonForm({ ...lessonForm, level: e.target.value })}
                    className="w-full h-9 px-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono"
                  >
                    <option value="BASIC">BASIC</option>
                    <option value="INTERMEDIATE">INTERMEDIATE</option>
                    <option value="ADVANCED">ADVANCED</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Duration (Minutes)</label>
                  <input
                    type="number"
                    value={lessonForm.durationMinutes}
                    onChange={(e) => setLessonForm({ ...lessonForm, durationMinutes: Number(e.target.value) })}
                    className="w-full h-9 px-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Status</label>
                  <select
                    value={lessonForm.status}
                    onChange={(e) => setLessonForm({ ...lessonForm, status: e.target.value })}
                    className="w-full h-9 px-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono"
                  >
                    <option value="PUBLISHED">PUBLISHED (Requires 20 Qs)</option>
                    <option value="DRAFT">DRAFT</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Description</label>
                <textarea
                  rows={2}
                  required
                  value={lessonForm.description}
                  onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Learning Objective</label>
                <input
                  type="text"
                  required
                  value={lessonForm.learningObjective}
                  onChange={(e) => setLessonForm({ ...lessonForm, learningObjective: e.target.value })}
                  className="w-full h-9 px-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Markdown Content</label>
                <textarea
                  rows={6}
                  required
                  value={lessonForm.content}
                  onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsLessonModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all"
                >
                  Save Lesson
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
