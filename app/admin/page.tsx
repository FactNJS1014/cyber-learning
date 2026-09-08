import React from 'react';
import { redirect } from 'next/navigation';
import {
  Shield,
  Settings,
  Users,
  BookOpen,
  FileCheck,
  Award,
  Activity,
  AlertTriangle
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import SecurityWarningBanner from '@/components/SecurityWarningBanner';
import { getCurrentUser } from '@/lib/auth';
import {
  getAdminAnalytics,
  getAllUsers,
  getAllLessons,
  getAllProjectSubmissions,
  getAuditLogs,
  getCourses,
  getDb
} from '@/lib/db';
import AdminDashboardClient from './AdminDashboardClient';

export default async function AdminPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  if (user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
        <Navbar user={user as any} />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full p-8 rounded-2xl bg-slate-900 border border-red-500/30 text-center space-y-4 shadow-2xl">
            <div className="h-16 w-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold text-white">403 - Forbidden Access</h2>
            <p className="text-xs text-slate-400">
              Your account does not possess Administrator privileges to view the Academy CMS console.
            </p>
          </div>
        </main>
      </div>
    );
  }

  const analytics = await getAdminAnalytics();
  const allUsers = await getAllUsers();
  const allLessons = await getAllLessons();
  const allSubmissions = await getAllProjectSubmissions();
  const auditLogs = await getAuditLogs();
  const courses = await getCourses();
  const db = getDb();

  const safeUsers = allUsers.map((u) => {
    const { passwordHash, ...safe } = u;
    const progress = db.lessonProgress.filter((p) => p.userId === u.id && p.isCompleted).length;
    const cert = db.certificates.some((c) => c.userId === u.id);
    return {
      ...safe,
      completedLessonsCount: progress,
      hasCertificate: cert,
    };
  });

  const enrichedLessons = allLessons.map((l) => {
    const quiz = db.quizzes.find((q) => q.lessonId === l.id);
    const questionCount = quiz?.questions.length || 0;
    const course = db.courses.find((c) => c.id === l.courseId);
    return {
      ...l,
      courseTitle: course?.title,
      questionCount,
      isPublishable: questionCount === 20,
    };
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      <Navbar user={user as any} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <SecurityWarningBanner compact />

        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-semibold uppercase tracking-wider">
              <Settings className="h-4 w-4" />
              <span>Enterprise Admin Console</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Curriculum CMS & Student Management
            </h1>
            <p className="text-xs text-slate-400">
              Manage student authorizations, audit 20-question lesson quizzes, grade capstone submissions, and inspect security telemetry.
            </p>
          </div>
        </div>

        {/* Client Interactive Admin Panel */}
        <AdminDashboardClient
          initialAnalytics={analytics}
          initialUsers={safeUsers as any}
          initialLessons={enrichedLessons as any}
          initialSubmissions={allSubmissions}
          initialLogs={auditLogs}
          courses={courses}
          adminId={user.id}
        />
      </main>
    </div>
  );
}
