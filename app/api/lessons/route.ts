import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getAllLessons, getCourses, getLevels, getDb } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const searchParams = req.nextUrl.searchParams;
    const level = searchParams.get('level');
    const courseId = searchParams.get('courseId');
    const query = searchParams.get('q');

    const db = getDb();
    let lessons = await getAllLessons();

    if (level) {
      lessons = lessons.filter((l) => l.level.toLowerCase() === level.toLowerCase());
    }

    if (courseId) {
      lessons = lessons.filter((l) => l.courseId === courseId);
    }

    if (query) {
      const q = query.toLowerCase();
      lessons = lessons.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q) ||
          l.learningObjective.toLowerCase().includes(q)
      );
    }

    // Attach user progress if logged in
    const userCompletedSet = new Set(
      user ? db.lessonProgress.filter((p) => p.userId === user.id && p.isCompleted).map((p) => p.lessonId) : []
    );
    const userBookmarkSet = new Set(
      user ? db.bookmarks.filter((b) => b.userId === user.id).map((b) => b.lessonId) : []
    );

    const enriched = lessons.map((l) => ({
      ...l,
      isCompleted: userCompletedSet.has(l.id),
      isBookmarked: userBookmarkSet.has(l.id),
    }));

    const levels = await getLevels();
    const courses = await getCourses();

    return NextResponse.json({
      lessons: enriched,
      levels,
      courses,
    });
  } catch (err: any) {
    console.error('Error fetching lessons:', err);
    return NextResponse.json({ error: 'Failed to fetch lessons' }, { status: 500 });
  }
}
