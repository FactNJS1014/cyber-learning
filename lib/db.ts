import fs from 'fs';
import path from 'path';
import {
  User,
  Session,
  Level,
  Course,
  Lesson,
  Quiz,
  QuizQuestion,
  QuizAttempt,
  Lab,
  LabProgress,
  FinalProject,
  ProjectSubmission,
  Certificate,
  Achievement,
  UserAchievement,
  Bookmark,
  Note,
  LearningActivity,
  AuditLog,
  LessonProgress,
} from '@/types';
import {
  initialUsers,
  initialLevels,
  initialCourses,
  initialLessons,
  initialQuizzes,
  initialLabs,
  initialFinalProject,
  initialAchievements,
} from './seedData';
import { isNeonConfigured, initNeonSchema } from './neon';

interface DatabaseSchema {
  users: User[];
  sessions: Session[];
  levels: Level[];
  courses: Course[];
  lessons: Lesson[];
  quizzes: Quiz[];
  labs: Lab[];
  labProgress: LabProgress[];
  lessonProgress: LessonProgress[];
  quizAttempts: QuizAttempt[];
  finalProjects: FinalProject[];
  projectSubmissions: ProjectSubmission[];
  certificates: Certificate[];
  achievements: Achievement[];
  userAchievements: UserAchievement[];
  bookmarks: Bookmark[];
  notes: Note[];
  learningActivities: LearningActivity[];
  auditLogs: AuditLog[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// In-memory fallback in case filesystem is restricted or for fast reads
let memoryDb: DatabaseSchema | null = null;

function ensureDataDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    } catch (e) {
      console.warn('Could not create data dir:', e);
    }
  }
}

function getInitialDatabase(): DatabaseSchema {
  return {
    users: [...initialUsers],
    sessions: [],
    levels: [...initialLevels],
    courses: [...initialCourses],
    lessons: [...initialLessons],
    quizzes: [...initialQuizzes],
    labs: [...initialLabs],
    labProgress: [],
    lessonProgress: [],
    quizAttempts: [],
    finalProjects: [initialFinalProject],
    projectSubmissions: [],
    certificates: [],
    achievements: [...initialAchievements],
    userAchievements: [],
    bookmarks: [],
    notes: [],
    learningActivities: [],
    auditLogs: [],
  };
}

export function getDb(): DatabaseSchema {
  if (memoryDb) return memoryDb;

  ensureDataDirectory();

  // Lazy-initialize Neon PostgreSQL schema if database connection string is provided
  if (isNeonConfigured()) {
    initNeonSchema().catch((err) => {
      console.warn('Neon PostgreSQL initialization warning:', err);
    });
  }

  if (fs.existsSync(DB_FILE)) {
    try {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      memoryDb = JSON.parse(data);
      // Ensure all arrays exist
      if (!memoryDb!.users) {
        memoryDb = getInitialDatabase();
      } else {
        // Sync enriched Thai curriculum data while preserving user progress & credentials
        memoryDb!.levels = [...initialLevels];
        memoryDb!.courses = [...initialCourses];
        memoryDb!.lessons = [...initialLessons];
        memoryDb!.quizzes = [...initialQuizzes];
        memoryDb!.labs = [...initialLabs];
        memoryDb!.finalProjects = [initialFinalProject];
        memoryDb!.achievements = [...initialAchievements];
      }
      saveDb(memoryDb!);
      return memoryDb!;
    } catch (err) {
      console.error('Error reading db.json, re-initializing seed data:', err);
    }
  }

  memoryDb = getInitialDatabase();
  saveDb(memoryDb);
  return memoryDb;
}

export function saveDb(db: DatabaseSchema) {
  memoryDb = db;
  ensureDataDirectory();
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write db.json:', err);
  }
}

// ==================== USER OPERATIONS ====================
export async function findUserByEmail(email: string): Promise<User | null> {
  const db = getDb();
  return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export async function findUserById(id: string): Promise<User | null> {
  const db = getDb();
  return db.users.find((u) => u.id === id) || null;
}

export async function getAllUsers(): Promise<User[]> {
  const db = getDb();
  return db.users;
}

export async function createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
  const db = getDb();
  const newUser: User = {
    ...userData,
    id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.users.push(newUser);
  saveDb(db);
  return newUser;
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User | null> {
  const db = getDb();
  const index = db.users.findIndex((u) => u.id === id);
  if (index === -1) return null;
  db.users[index] = {
    ...db.users[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveDb(db);
  return db.users[index];
}

export async function deleteUser(id: string): Promise<boolean> {
  const db = getDb();
  const index = db.users.findIndex((u) => u.id === id);
  if (index === -1) return false;
  db.users.splice(index, 1);
  // Clean up sessions and progress
  db.sessions = db.sessions.filter((s) => s.userId !== id);
  db.lessonProgress = db.lessonProgress.filter((p) => p.userId !== id);
  db.quizAttempts = db.quizAttempts.filter((q) => q.userId !== id);
  db.labProgress = db.labProgress.filter((l) => l.userId !== id);
  saveDb(db);
  return true;
}

// ==================== SESSION OPERATIONS ====================
export async function createSession(userId: string, sessionToken: string, expiresAt: Date): Promise<Session> {
  const db = getDb();
  const session: Session = {
    id: `sess-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    userId,
    sessionToken,
    expiresAt: expiresAt.toISOString(),
    createdAt: new Date().toISOString(),
  };
  db.sessions.push(session);
  saveDb(db);
  return session;
}

export async function findSessionByToken(token: string): Promise<(Session & { user: User }) | null> {
  const db = getDb();
  const session = db.sessions.find((s) => s.sessionToken === token);
  if (!session) return null;

  // Check expiration
  if (new Date(session.expiresAt).getTime() < Date.now()) {
    // Expired - clean it up
    db.sessions = db.sessions.filter((s) => s.id !== session.id);
    saveDb(db);
    return null;
  }

  const user = db.users.find((u) => u.id === session.userId);
  if (!user || user.status !== 'ACTIVE') return null;

  return { ...session, user };
}

export async function deleteSessionByToken(token: string): Promise<boolean> {
  const db = getDb();
  const initialLen = db.sessions.length;
  db.sessions = db.sessions.filter((s) => s.sessionToken !== token);
  saveDb(db);
  return db.sessions.length < initialLen;
}

export async function deleteSessionsByUserId(userId: string): Promise<void> {
  const db = getDb();
  db.sessions = db.sessions.filter((s) => s.userId !== userId);
  saveDb(db);
}

// ==================== LEVEL / COURSE / LESSON OPERATIONS ====================
export async function getLevels(): Promise<Level[]> {
  const db = getDb();
  return db.levels.sort((a, b) => a.order - b.order);
}

export async function getCourses(): Promise<Course[]> {
  const db = getDb();
  return db.courses.sort((a, b) => a.order - b.order);
}

export async function getCourseById(id: string): Promise<(Course & { lessons: Lesson[] }) | null> {
  const db = getDb();
  const course = db.courses.find((c) => c.id === id || c.slug === id);
  if (!course) return null;
  const lessons = db.lessons.filter((l) => l.courseId === course.id).sort((a, b) => a.order - b.order);
  return { ...course, lessons };
}

export async function getAllLessons(): Promise<Lesson[]> {
  const db = getDb();
  return db.lessons.sort((a, b) => a.order - b.order);
}

export async function getLessonById(idOrSlug: string): Promise<(Lesson & { course?: Course; quiz?: Quiz; lab?: Lab }) | null> {
  const db = getDb();
  const lesson = db.lessons.find((l) => l.id === idOrSlug || l.slug === idOrSlug);
  if (!lesson) return null;
  const course = db.courses.find((c) => c.id === lesson.courseId);
  const quiz = db.quizzes.find((q) => q.lessonId === lesson.id);
  const lab = db.labs.find((l) => l.lessonId === lesson.id);
  return { ...lesson, course, quiz, lab };
}

export async function createLesson(lessonData: Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lesson> {
  const db = getDb();
  const id = `lesson-${Date.now()}`;
  const newLesson: Lesson = {
    ...lessonData,
    id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.lessons.push(newLesson);
  saveDb(db);
  return newLesson;
}

export async function updateLesson(id: string, updates: Partial<Lesson>): Promise<Lesson | null> {
  const db = getDb();
  const index = db.lessons.findIndex((l) => l.id === id);
  if (index === -1) return null;
  db.lessons[index] = {
    ...db.lessons[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveDb(db);
  return db.lessons[index];
}

export async function deleteLesson(id: string): Promise<boolean> {
  const db = getDb();
  const index = db.lessons.findIndex((l) => l.id === id);
  if (index === -1) return false;
  db.lessons.splice(index, 1);
  db.quizzes = db.quizzes.filter((q) => q.lessonId !== id);
  db.labs = db.labs.filter((l) => l.lessonId !== id);
  db.lessonProgress = db.lessonProgress.filter((p) => p.lessonId !== id);
  saveDb(db);
  return true;
}

// ==================== QUIZ OPERATIONS ====================
// IMPORTANT: Pre-submission quiz query MUST NOT return correctAnswer or explanation!
export async function getQuizForStudent(quizIdOrLessonId: string): Promise<{
  id: string;
  lessonId: string;
  title: string;
  passingScore: number;
  totalQuestions: number;
  questions: {
    id: string;
    order: number;
    question: string;
    questionType: string;
    options: { key: string; text: string }[];
  }[];
} | null> {
  const db = getDb();
  const quiz = db.quizzes.find((q) => q.id === quizIdOrLessonId || q.lessonId === quizIdOrLessonId);
  if (!quiz) return null;

  return {
    id: quiz.id,
    lessonId: quiz.lessonId,
    title: quiz.title,
    passingScore: quiz.passingScore,
    totalQuestions: quiz.questions.length,
    questions: quiz.questions
      .sort((a, b) => a.order - b.order)
      .map((q) => ({
        id: q.id,
        order: q.order,
        question: q.question,
        questionType: q.questionType,
        options: q.options,
        // NEVER expose correctAnswer or explanation here
      })),
  };
}

export async function getQuizWithAnswers(quizIdOrLessonId: string): Promise<Quiz | null> {
  const db = getDb();
  return db.quizzes.find((q) => q.id === quizIdOrLessonId || q.lessonId === quizIdOrLessonId) || null;
}

export async function submitQuizAttempt(
  userId: string,
  quizId: string,
  submittedAnswers: Record<string, string>
): Promise<QuizAttempt> {
  const db = getDb();
  const quiz = db.quizzes.find((q) => q.id === quizId);
  if (!quiz) throw new Error('Quiz not found');

  let correctCount = 0;
  const reviewDetails = quiz.questions.map((q) => {
    const selected = submittedAnswers[q.id] || '';
    const isCorrect = selected.toUpperCase() === q.correctAnswer.toUpperCase();
    if (isCorrect) correctCount++;
    return {
      questionId: q.id,
      question: q.question,
      selectedAnswer: selected,
      correctAnswer: q.correctAnswer,
      isCorrect,
      explanation: q.explanation,
    };
  });

  const total = quiz.questions.length;
  const percentage = Math.round((correctCount / total) * 100);
  const passed = percentage >= quiz.passingScore;

  const attempt: QuizAttempt = {
    id: `attempt-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    userId,
    quizId,
    score: correctCount,
    totalQuestions: total,
    percentage,
    passed,
    userAnswers: submittedAnswers,
    reviewDetails,
    createdAt: new Date().toISOString(),
  };

  db.quizAttempts.push(attempt);

  // If passed, mark lesson completed
  if (passed) {
    await markLessonCompleted(userId, quiz.lessonId);
    // Check achievements
    await checkAndAwardAchievements(userId);
  }

  saveDb(db);
  return attempt;
}

export async function getQuizAttempts(userId: string): Promise<QuizAttempt[]> {
  const db = getDb();
  return db.quizAttempts.filter((a) => a.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// ==================== LAB OPERATIONS ====================
export async function getAllLabs(): Promise<Lab[]> {
  const db = getDb();
  return db.labs;
}

export async function getLabById(idOrSlug: string): Promise<Lab | null> {
  const db = getDb();
  return db.labs.find((l) => l.id === idOrSlug || l.slug === idOrSlug || l.lessonId === idOrSlug) || null;
}

export async function markLabCompleted(userId: string, labId: string, notes?: string): Promise<LabProgress> {
  const db = getDb();
  let progress = db.labProgress.find((p) => p.userId === userId && p.labId === labId);
  if (!progress) {
    const newProgress: LabProgress = {
      id: `labprog-${Date.now()}`,
      userId,
      labId,
      isCompleted: true,
      notes,
      completedAt: new Date().toISOString(),
    };
    db.labProgress.push(newProgress);
    progress = newProgress;
  } else {
    progress.isCompleted = true;
    progress.completedAt = new Date().toISOString();
    if (notes) progress.notes = notes;
  }
  await checkAndAwardAchievements(userId);
  saveDb(db);
  return progress;
}

export async function getLabProgress(userId: string): Promise<LabProgress[]> {
  const db = getDb();
  return db.labProgress.filter((p) => p.userId === userId);
}

// ==================== PROGRESS & ACHIEVEMENTS ====================
export async function markLessonCompleted(userId: string, lessonId: string): Promise<LessonProgress> {
  const db = getDb();
  let progress = db.lessonProgress.find((p) => p.userId === userId && p.lessonId === lessonId);
  if (!progress) {
    const newProgress: LessonProgress = {
      id: `prog-${Date.now()}`,
      userId,
      lessonId,
      isCompleted: true,
      completedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.lessonProgress.push(newProgress);
    progress = newProgress;
  } else {
    progress.isCompleted = true;
    progress.completedAt = new Date().toISOString();
  }

  // Add learning activity
  db.learningActivities.push({
    id: `act-${Date.now()}`,
    userId,
    action: 'LESSON_COMPLETED',
    details: `Completed lesson ${lessonId}`,
    timestamp: new Date().toISOString(),
  });

  saveDb(db);
  await checkAndAwardAchievements(userId);
  return progress;
}

export async function getUserProgress(userId: string) {
  const db = getDb();
  const totalLessons = db.lessons.length;
  const userCompletedLessons = db.lessonProgress.filter((p) => p.userId === userId && p.isCompleted);
  const completedLessonIds = new Set(userCompletedLessons.map((p) => p.lessonId));

  // Level progress
  const basicLessons = db.lessons.filter((l) => l.level === 'BASIC');
  const intermediateLessons = db.lessons.filter((l) => l.level === 'INTERMEDIATE');
  const advancedLessons = db.lessons.filter((l) => l.level === 'ADVANCED');

  const basicCompleted = basicLessons.filter((l) => completedLessonIds.has(l.id)).length;
  const intermediateCompleted = intermediateLessons.filter((l) => completedLessonIds.has(l.id)).length;
  const advancedCompleted = advancedLessons.filter((l) => completedLessonIds.has(l.id)).length;

  const basicPct = basicLessons.length > 0 ? Math.round((basicCompleted / basicLessons.length) * 100) : 0;
  const interPct = intermediateLessons.length > 0 ? Math.round((intermediateCompleted / intermediateLessons.length) * 100) : 0;
  const advPct = advancedLessons.length > 0 ? Math.round((advancedCompleted / advancedLessons.length) * 100) : 0;

  const overallPct = totalLessons > 0 ? Math.round((completedLessonIds.size / totalLessons) * 100) : 0;

  // Quiz stats
  const userAttempts = db.quizAttempts.filter((a) => a.userId === userId);
  const passedQuizzes = new Set(userAttempts.filter((a) => a.passed).map((a) => a.quizId));
  const avgQuizScore = userAttempts.length > 0
    ? Math.round(userAttempts.reduce((acc, curr) => acc + curr.percentage, 0) / userAttempts.length)
    : 0;

  // Labs stats
  const userLabs = db.labProgress.filter((l) => l.userId === userId && l.isCompleted);

  // Final Project status
  const finalProjectSubmission = db.projectSubmissions.find((s) => s.userId === userId);

  // Certificate status
  const certificate = db.certificates.find((c) => c.userId === userId);

  // Check eligibility for Final Project: Basic, Intermediate, Advanced completed + Quizzes passed
  const allBasicPassed = basicPct === 100;
  const allInterPassed = interPct === 100;
  const allAdvPassed = advPct === 100;
  const isFinalProjectUnlocked = allBasicPassed && allInterPassed && allAdvPassed;

  return {
    overallPercentage: overallPct,
    completedLessonsCount: completedLessonIds.size,
    totalLessonsCount: totalLessons,
    levels: {
      basic: { percentage: basicPct, completed: basicCompleted, total: basicLessons.length },
      intermediate: { percentage: interPct, completed: intermediateCompleted, total: intermediateLessons.length },
      advanced: { percentage: advPct, completed: advancedCompleted, total: advancedLessons.length },
    },
    quizStats: {
      passedCount: passedQuizzes.size,
      totalQuizzes: db.quizzes.length,
      averageScore: avgQuizScore,
      totalAttempts: userAttempts.length,
    },
    labsStats: {
      completedCount: userLabs.length,
      totalLabs: db.labs.length,
    },
    finalProject: {
      isUnlocked: isFinalProjectUnlocked,
      submission: finalProjectSubmission || null,
    },
    certificate: certificate || null,
  };
}

export async function checkAndAwardAchievements(userId: string) {
  const db = getDb();
  const unlocked = new Set(db.userAchievements.filter((u) => u.userId === userId).map((u) => u.achievementId));
  const progress = await getUserProgress(userId);

  const award = (code: string) => {
    const ach = db.achievements.find((a) => a.code === code);
    if (ach && !unlocked.has(ach.id)) {
      db.userAchievements.push({
        id: `uach-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        userId,
        achievementId: ach.id,
        unlockedAt: new Date().toISOString(),
      });
      unlocked.add(ach.id);
    }
  };

  if (progress.completedLessonsCount >= 1) award('FIRST_LESSON');
  if (progress.quizStats.passedCount >= 1) award('FIRST_QUIZ');
  if (progress.completedLessonsCount >= 5) award('SECURITY_EXPLORER');
  if (progress.labsStats.completedCount >= 1) award('LAB_BEGINNER');
  if (progress.levels.basic.percentage === 100) award('BASIC_COMPLETED');
  if (progress.levels.intermediate.percentage === 100) award('INTERMEDIATE_COMPLETED');
  if (progress.levels.advanced.percentage === 100) award('ADVANCED_COMPLETED');

  // Check 100% quiz score
  const perfectScore = db.quizAttempts.some((a) => a.userId === userId && a.percentage === 100);
  if (perfectScore) award('QUIZ_MASTER');

  // Check Final Project
  if (progress.finalProject.submission?.status === 'GRADED' && (progress.finalProject.submission.score || 0) >= 70) {
    award('FINAL_PROJECT_COMPLETED');
  }

  // Check Certificate
  if (progress.certificate) {
    award('CERTIFIED_SECURITY_LEARNER');
  }

  saveDb(db);
}

export async function getUserAchievements(userId: string): Promise<(Achievement & { unlockedAt?: string })[]> {
  const db = getDb();
  const userAchs = db.userAchievements.filter((u) => u.userId === userId);
  const unlockedMap = new Map(userAchs.map((u) => [u.achievementId, u.unlockedAt]));

  return db.achievements.map((ach) => ({
    ...ach,
    unlockedAt: unlockedMap.get(ach.id),
  }));
}

// ==================== FINAL PROJECT & SUBMISSION ====================
export async function getFinalProject(): Promise<FinalProject> {
  const db = getDb();
  return db.finalProjects[0] || initialFinalProject;
}

export async function submitFinalProject(
  userId: string,
  submissionData: Omit<ProjectSubmission, 'id' | 'userId' | 'status' | 'createdAt'>
): Promise<ProjectSubmission> {
  const db = getDb();
  const existing = db.projectSubmissions.findIndex((s) => s.userId === userId);

  const submission: ProjectSubmission = {
    ...submissionData,
    id: `sub-${Date.now()}`,
    userId,
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  };

  if (existing >= 0) {
    db.projectSubmissions[existing] = submission;
  } else {
    db.projectSubmissions.push(submission);
  }

  saveDb(db);
  return submission;
}

export async function gradeProjectSubmission(
  submissionId: string,
  score: number,
  scoreBreakdown: Record<string, number>,
  feedback: string
): Promise<ProjectSubmission | null> {
  const db = getDb();
  const index = db.projectSubmissions.findIndex((s) => s.id === submissionId);
  if (index === -1) return null;

  const sub = db.projectSubmissions[index];
  sub.score = score;
  sub.scoreBreakdown = scoreBreakdown;
  sub.feedback = feedback;
  sub.status = score >= 70 ? 'GRADED' : 'REJECTED';
  sub.gradedAt = new Date().toISOString();

  // If passed, award achievement and check certificate
  if (score >= 70) {
    await checkAndAwardAchievements(sub.userId);
  }

  saveDb(db);
  return sub;
}

export async function getAllProjectSubmissions(): Promise<ProjectSubmission[]> {
  const db = getDb();
  return db.projectSubmissions.map((s) => {
    const user = db.users.find((u) => u.id === s.userId);
    return {
      ...s,
      userName: user?.name,
      userEmail: user?.email,
    };
  });
}

// ==================== CERTIFICATE OPERATIONS ====================
export async function generateCertificate(userId: string): Promise<Certificate> {
  const db = getDb();
  const user = db.users.find((u) => u.id === userId);
  if (!user) throw new Error('User not found');

  // Check if certificate already exists
  const existing = db.certificates.find((c) => c.userId === userId);
  if (existing) return existing;

  // Verify eligibility: Basic + Intermediate + Advanced + Quizzes + Final Project >= 70
  const progress = await getUserProgress(userId);
  const isEligible =
    progress.levels.basic.percentage === 100 &&
    progress.levels.intermediate.percentage === 100 &&
    progress.levels.advanced.percentage === 100 &&
    progress.finalProject.submission?.status === 'GRADED' &&
    (progress.finalProject.submission.score || 0) >= 70;

  if (!isEligible) {
    throw new Error('User has not completed all required courses, quizzes, and the final project');
  }

  const certNumber = `CSL-${Math.floor(10000000 + Math.random() * 90000000)}`;
  const verificationCode = `V-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

  const cert: Certificate = {
    id: `cert-${Date.now()}`,
    userId,
    certificateNo: certNumber,
    programName: 'Cyber Security Learning Program',
    level: 'Basic → Intermediate → Advanced',
    issuedAt: new Date().toISOString().split('T')[0],
    verificationCode,
    userName: user.name,
  };

  db.certificates.push(cert);
  saveDb(db);

  await checkAndAwardAchievements(userId);
  await recordAuditLog({
    userId,
    action: 'ISSUE_CERTIFICATE',
    resource: 'Certificate',
    resourceId: cert.id,
    metadata: { certNumber, userName: user.name },
  });

  return cert;
}

export async function getCertificateByNo(certificateNo: string): Promise<(Certificate & { user?: { name: string; email: string } }) | null> {
  const db = getDb();
  const cert = db.certificates.find(
    (c) => c.certificateNo.toUpperCase() === certificateNo.toUpperCase() || c.id === certificateNo
  );
  if (!cert) return null;
  const user = db.users.find((u) => u.id === cert.userId);
  return {
    ...cert,
    user: user ? { name: user.name, email: user.email } : undefined,
  };
}

export async function getUserCertificate(userId: string): Promise<Certificate | null> {
  const db = getDb();
  return db.certificates.find((c) => c.userId === userId) || null;
}

export async function getAllCertificates(): Promise<Certificate[]> {
  const db = getDb();
  return db.certificates.map((c) => {
    const user = db.users.find((u) => u.id === c.userId);
    return { ...c, userName: user?.name };
  });
}

// ==================== BOOKMARKS & NOTES ====================
export async function toggleBookmark(userId: string, lessonId: string): Promise<boolean> {
  const db = getDb();
  const index = db.bookmarks.findIndex((b) => b.userId === userId && b.lessonId === lessonId);
  if (index >= 0) {
    db.bookmarks.splice(index, 1);
    saveDb(db);
    return false; // unbookmarked
  } else {
    db.bookmarks.push({
      id: `bm-${Date.now()}`,
      userId,
      lessonId,
      createdAt: new Date().toISOString(),
    } as any);
    saveDb(db);
    return true; // bookmarked
  }
}

export async function getUserBookmarks(userId: string): Promise<Lesson[]> {
  const db = getDb();
  const bookmarkedLessonIds = new Set(db.bookmarks.filter((b) => b.userId === userId).map((b) => b.lessonId));
  return db.lessons.filter((l) => bookmarkedLessonIds.has(l.id));
}

export async function getNote(userId: string, lessonId: string): Promise<Note | null> {
  const db = getDb();
  return db.notes.find((n) => n.userId === userId && n.lessonId === lessonId) || null;
}

export async function saveNote(userId: string, lessonId: string, content: string): Promise<Note> {
  const db = getDb();
  let note = db.notes.find((n) => n.userId === userId && n.lessonId === lessonId);
  if (!note) {
    note = {
      id: `note-${Date.now()}`,
      userId,
      lessonId,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as any;
    db.notes.push(note!);
  } else {
    note.content = content;
    note.updatedAt = new Date().toISOString();
  }
  saveDb(db);
  return note!;
}

// ==================== AUDIT LOGS ====================
export async function recordAuditLog(entry: {
  userId?: string;
  userName?: string;
  action: string;
  resource: string;
  resourceId?: string;
  metadata?: any;
}): Promise<AuditLog> {
  const db = getDb();
  const log: AuditLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    ...entry,
    timestamp: new Date().toISOString(),
  };
  db.auditLogs.unshift(log);
  // Keep max 500 audit logs
  if (db.auditLogs.length > 500) db.auditLogs.pop();
  saveDb(db);
  return log;
}

export async function getAuditLogs(): Promise<AuditLog[]> {
  const db = getDb();
  return db.auditLogs;
}

// ==================== ADMIN ANALYTICS ====================
export async function getAdminAnalytics() {
  const db = getDb();
  const totalUsers = db.users.length;
  const activeStudents = db.users.filter((u) => u.role === 'STUDENT' && u.status === 'ACTIVE').length;
  const totalLessons = db.lessons.length;
  const totalQuizAttempts = db.quizAttempts.length;
  const avgQuizScore = totalQuizAttempts > 0
    ? Math.round(db.quizAttempts.reduce((acc, curr) => acc + curr.percentage, 0) / totalQuizAttempts)
    : 0;
  const certificatesIssued = db.certificates.length;
  const totalSubmissions = db.projectSubmissions.length;

  // Level counts
  const basicCount = db.lessons.filter((l) => l.level === 'BASIC').length;
  const intermediateCount = db.lessons.filter((l) => l.level === 'INTERMEDIATE').length;
  const advancedCount = db.lessons.filter((l) => l.level === 'ADVANCED').length;

  return {
    totalUsers,
    activeStudents,
    totalLessons,
    totalQuizAttempts,
    averageScore: avgQuizScore,
    completedCourses: db.courses.length,
    certificatesIssued,
    finalProjects: totalSubmissions,
    levelDistribution: {
      basic: basicCount,
      intermediate: intermediateCount,
      advanced: advancedCount,
    },
    recentActivities: db.auditLogs.slice(0, 10),
  };
}
