import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getUserProgress, getUserAchievements, getUserBookmarks } from '@/lib/db';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    const progress = await getUserProgress(user.id);
    const achievements = await getUserAchievements(user.id);
    const bookmarks = await getUserBookmarks(user.id);

    return NextResponse.json({
      authenticated: true,
      user,
      progress,
      achievements,
      bookmarksCount: bookmarks.length,
    });
  } catch (err: any) {
    console.error('Error fetching current user:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
