import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { getAllLessons, createLesson, updateLesson, deleteLesson, recordAuditLog, getDb } from '@/lib/db';

export async function GET() {
  try {
    await requireAdmin();
    const db = getDb();
    const lessons = await getAllLessons();

    const enriched = lessons.map((l) => {
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

    return NextResponse.json({ lessons: enriched });
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (err.message === 'FORBIDDEN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const body = await req.json();

    const {
      title,
      slug,
      courseId,
      level,
      description,
      learningObjective,
      content,
      labContent,
      order,
      status,
      durationMinutes,
      questions,
    } = body;

    if (!title || !slug || !courseId || !level || !description || !content) {
      return NextResponse.json({ error: 'Required fields are missing' }, { status: 400 });
    }

    // Validation: If publishing, check question count
    if (status === 'PUBLISHED') {
      const qCount = Array.isArray(questions) ? questions.length : 0;
      if (qCount !== 20) {
        return NextResponse.json(
          {
            error: 'INVALID_QUESTION_COUNT',
            message: `Cannot publish lesson. Validation rule requires exactly 20 quiz questions per lesson (currently ${qCount}).`,
          },
          { status: 400 }
        );
      }
    }

    const lesson = await createLesson({
      title: title.trim(),
      slug: slug.trim().toLowerCase().replace(/\s+/g, '-'),
      courseId,
      level,
      description: description.trim(),
      learningObjective: (learningObjective || '').trim(),
      content: content.trim(),
      labContent: labContent?.trim() || undefined,
      order: order ? Number(order) : 1,
      status: status || 'DRAFT',
      durationMinutes: durationMinutes ? Number(durationMinutes) : 30,
    });

    // If questions provided, create or update quiz
    if (Array.isArray(questions) && questions.length > 0) {
      const db = getDb();
      const quizIndex = db.quizzes.findIndex((q) => q.lessonId === lesson.id);
      const quizObj = {
        id: `quiz-${lesson.id}`,
        lessonId: lesson.id,
        title: `Quiz: ${lesson.title}`,
        passingScore: 70,
        status: status || 'DRAFT',
        questions: questions.map((q: any, idx: number) => ({
          id: `q-${lesson.id}-${idx + 1}`,
          quizId: `quiz-${lesson.id}`,
          question: q.question,
          questionType: q.questionType || 'MULTIPLE_CHOICE',
          order: idx + 1,
          explanation: q.explanation || '',
          correctAnswer: q.correctAnswer || 'A',
          options: q.options || [],
        })),
      };

      if (quizIndex >= 0) {
        db.quizzes[quizIndex] = quizObj;
      } else {
        db.quizzes.push(quizObj);
      }
    }

    await recordAuditLog({
      userId: admin.id,
      userName: admin.name,
      action: 'CREATE_LESSON',
      resource: 'Lesson',
      resourceId: lesson.id,
      metadata: { title: lesson.title, level: lesson.level },
    });

    return NextResponse.json({ message: 'Lesson created successfully', lesson }, { status: 201 });
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (err.message === 'FORBIDDEN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    return NextResponse.json({ error: 'Failed to create lesson' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const body = await req.json();
    const { id, questions, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Lesson ID is required' }, { status: 400 });
    }

    const db = getDb();
    const existingQuiz = db.quizzes.find((q) => q.lessonId === id);

    // If publishing, enforce 20 questions rule
    if (updates.status === 'PUBLISHED') {
      const qCount = questions ? questions.length : existingQuiz?.questions.length || 0;
      if (qCount !== 20) {
        return NextResponse.json(
          {
            error: 'INVALID_QUESTION_COUNT',
            message: `Cannot publish lesson. Validation rule requires exactly 20 quiz questions (currently ${qCount}).`,
          },
          { status: 400 }
        );
      }
    }

    const updated = await updateLesson(id, updates);
    if (!updated) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    if (Array.isArray(questions)) {
      const quizIndex = db.quizzes.findIndex((q) => q.lessonId === id);
      const quizObj = {
        id: `quiz-${id}`,
        lessonId: id,
        title: `Quiz: ${updated.title}`,
        passingScore: 70,
        status: updates.status || 'PUBLISHED',
        questions: questions.map((q: any, idx: number) => ({
          id: q.id || `q-${id}-${idx + 1}`,
          quizId: `quiz-${id}`,
          question: q.question,
          questionType: q.questionType || 'MULTIPLE_CHOICE',
          order: idx + 1,
          explanation: q.explanation || '',
          correctAnswer: q.correctAnswer || 'A',
          options: q.options || [],
        })),
      };

      if (quizIndex >= 0) {
        db.quizzes[quizIndex] = quizObj;
      } else {
        db.quizzes.push(quizObj);
      }
    }

    await recordAuditLog({
      userId: admin.id,
      userName: admin.name,
      action: 'UPDATE_LESSON',
      resource: 'Lesson',
      resourceId: id,
      metadata: { updates },
    });

    return NextResponse.json({ message: 'Lesson updated successfully', lesson: updated });
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (err.message === 'FORBIDDEN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    return NextResponse.json({ error: 'Failed to update lesson' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Lesson ID is required' }, { status: 400 });
    }

    const success = await deleteLesson(id);
    if (!success) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    await recordAuditLog({
      userId: admin.id,
      userName: admin.name,
      action: 'DELETE_LESSON',
      resource: 'Lesson',
      resourceId: id,
    });

    return NextResponse.json({ message: 'Lesson deleted successfully' });
  } catch (err: any) {
    if (err.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (err.message === 'FORBIDDEN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    return NextResponse.json({ error: 'Failed to delete lesson' }, { status: 500 });
  }
}
