import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getLessonById, getNote, getDb } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: 'กรุณาสมัครสมาชิกหรือเข้าสู่ระบบก่อนเริ่มเรียน' },
        { status: 401 }
      );
    }

    const lesson = await getLessonById(id);
    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    const db = getDb();
    const progress = db.lessonProgress.find((p) => p.userId === user.id && p.lessonId === lesson.id);
    const isBookmarked = db.bookmarks.some((b) => b.userId === user.id && b.lessonId === lesson.id);
    const note = await getNote(user.id, lesson.id);

    // Get all lessons in same course for the course navigation sidebar
    const siblingLessons = db.lessons
      .filter((l) => l.courseId === lesson.courseId)
      .sort((a, b) => a.order - b.order)
      .map((l) => ({
        id: l.id,
        slug: l.slug,
        title: l.title,
        order: l.order,
        durationMinutes: l.durationMinutes,
        isCompleted: db.lessonProgress.some((p) => p.userId === user.id && p.lessonId === l.id && p.isCompleted),
      }));

    // Check if user has passed quiz
    const quizAttempt = db.quizAttempts
      .filter((a) => a.userId === user.id && a.quizId === (lesson.quiz?.id || `quiz-${lesson.id}`))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

    return NextResponse.json({
      lesson,
      course: lesson.course,
      sidebarLessons: siblingLessons,
      isCompleted: progress?.isCompleted || false,
      isBookmarked,
      userNote: note?.content || '',
      latestQuizAttempt: quizAttempt
        ? {
            score: quizAttempt.score,
            totalQuestions: quizAttempt.totalQuestions,
            percentage: quizAttempt.percentage,
            passed: quizAttempt.passed,
            createdAt: quizAttempt.createdAt,
          }
        : null,
    });
  } catch (err: any) {
    console.error('Error fetching lesson:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
