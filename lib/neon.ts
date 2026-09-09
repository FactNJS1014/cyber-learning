import { neon, Pool } from '@neondatabase/serverless';
import {
  User,
  Session,
  Level,
  Course,
  Lesson,
  Quiz,
  QuizAttempt,
  Lab,
  LabProgress,
  LessonProgress,
  FinalProject,
  ProjectSubmission,
  Certificate,
  Achievement,
  UserAchievement,
  Bookmark,
  Note,
  LearningActivity,
  AuditLog,
} from '@/types';

let poolInstance: Pool | null = null;
let schemaInitialized = false;

export function getDatabaseUrl(): string | undefined {
  return (
    process.env.DATABASE_URL ||
    process.env.NEON_DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.PG_CONNECTION_STRING
  );
}

export function isNeonConfigured(): boolean {
  const url = getDatabaseUrl();
  return Boolean(url && url.trim().length > 0 && !url.includes('placeholder'));
}

export function getNeonSql() {
  const dbUrl = getDatabaseUrl();
  if (!dbUrl) {
    throw new Error('DATABASE_URL environment variable is required for Neon PostgreSQL.');
  }
  return neon(dbUrl);
}

export function getNeonPool(): Pool {
  if (!poolInstance) {
    const dbUrl = getDatabaseUrl();
    if (!dbUrl) {
      throw new Error('DATABASE_URL environment variable is required for Neon PostgreSQL.');
    }
    poolInstance = new Pool({ connectionString: dbUrl });
  }
  return poolInstance;
}

export async function initNeonSchema(): Promise<boolean> {
  if (schemaInitialized || !isNeonConfigured()) return true;

  try {
    const sql = getNeonSql();

    // Create tables for Neon Postgres
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(128) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'STUDENT',
        status VARCHAR(50) DEFAULT 'ACTIVE',
        avatar_url TEXT,
        bio TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS sessions (
        id VARCHAR(128) PRIMARY KEY,
        user_id VARCHAR(128) REFERENCES users(id) ON DELETE CASCADE,
        session_token TEXT UNIQUE NOT NULL,
        expires_at TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS levels (
        id VARCHAR(128) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        level_order INT DEFAULT 1,
        badge VARCHAR(128),
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS courses (
        id VARCHAR(128) PRIMARY KEY,
        level_id VARCHAR(128) REFERENCES levels(id) ON DELETE SET NULL,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255),
        description TEXT,
        course_order INT DEFAULT 1,
        icon VARCHAR(128),
        duration_hours NUMERIC DEFAULT 1,
        xp_reward INT DEFAULT 100,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS lessons (
        id VARCHAR(128) PRIMARY KEY,
        course_id VARCHAR(128) REFERENCES courses(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255),
        lesson_order INT DEFAULT 1,
        content TEXT,
        duration_minutes INT DEFAULT 15,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS quizzes (
        id VARCHAR(128) PRIMARY KEY,
        lesson_id VARCHAR(128) REFERENCES lessons(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        passing_score INT DEFAULT 70,
        xp_reward INT DEFAULT 50,
        questions_json JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS quiz_attempts (
        id VARCHAR(128) PRIMARY KEY,
        user_id VARCHAR(128) REFERENCES users(id) ON DELETE CASCADE,
        quiz_id VARCHAR(128) REFERENCES quizzes(id) ON DELETE CASCADE,
        score INT NOT NULL,
        passed BOOLEAN DEFAULT FALSE,
        answers_json JSONB DEFAULT '[]'::jsonb,
        completed_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS labs (
        id VARCHAR(128) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255),
        description TEXT,
        category VARCHAR(100),
        difficulty VARCHAR(50) DEFAULT 'BEGINNER',
        estimated_minutes INT DEFAULT 30,
        xp_reward INT DEFAULT 150,
        terminal_template TEXT,
        flag_secret TEXT,
        environment_target TEXT,
        steps_json JSONB DEFAULT '[]'::jsonb,
        solution_guide TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS lab_progress (
        id VARCHAR(128) PRIMARY KEY,
        user_id VARCHAR(128) REFERENCES users(id) ON DELETE CASCADE,
        lab_id VARCHAR(128) REFERENCES labs(id) ON DELETE CASCADE,
        is_completed BOOLEAN DEFAULT FALSE,
        notes TEXT,
        completed_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS lesson_progress (
        id VARCHAR(128) PRIMARY KEY,
        user_id VARCHAR(128) REFERENCES users(id) ON DELETE CASCADE,
        lesson_id VARCHAR(128) REFERENCES lessons(id) ON DELETE CASCADE,
        is_completed BOOLEAN DEFAULT FALSE,
        completed_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS final_projects (
        id VARCHAR(128) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        scenario TEXT,
        description TEXT,
        rubric_json JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS project_submissions (
        id VARCHAR(128) PRIMARY KEY,
        user_id VARCHAR(128) REFERENCES users(id) ON DELETE CASCADE,
        project_id VARCHAR(128) REFERENCES final_projects(id) ON DELETE CASCADE,
        status VARCHAR(50) DEFAULT 'PENDING',
        report_content TEXT,
        findings_json JSONB DEFAULT '[]'::jsonb,
        score INT,
        feedback TEXT,
        submitted_at TIMESTAMPTZ DEFAULT NOW(),
        graded_at TIMESTAMPTZ
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS certificates (
        id VARCHAR(128) PRIMARY KEY,
        user_id VARCHAR(128) REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        issue_date TIMESTAMPTZ DEFAULT NOW(),
        credential_id VARCHAR(128) UNIQUE NOT NULL,
        verification_hash TEXT,
        pdf_data_url TEXT
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS achievements (
        id VARCHAR(128) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        icon VARCHAR(128),
        category VARCHAR(100),
        xp_value INT DEFAULT 50
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS user_achievements (
        id VARCHAR(128) PRIMARY KEY,
        user_id VARCHAR(128) REFERENCES users(id) ON DELETE CASCADE,
        achievement_id VARCHAR(128) REFERENCES achievements(id) ON DELETE CASCADE,
        unlocked_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS bookmarks (
        id VARCHAR(128) PRIMARY KEY,
        user_id VARCHAR(128) REFERENCES users(id) ON DELETE CASCADE,
        lesson_id VARCHAR(128) REFERENCES lessons(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        url TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS notes (
        id VARCHAR(128) PRIMARY KEY,
        user_id VARCHAR(128) REFERENCES users(id) ON DELETE CASCADE,
        lesson_id VARCHAR(128) REFERENCES lessons(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS learning_activities (
        id VARCHAR(128) PRIMARY KEY,
        user_id VARCHAR(128) REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        timestamp TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id VARCHAR(128) PRIMARY KEY,
        user_id VARCHAR(128),
        action VARCHAR(100) NOT NULL,
        details TEXT NOT NULL,
        timestamp TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    schemaInitialized = true;
    console.log('Neon PostgreSQL Schema successfully initialized.');
    return true;
  } catch (error) {
    console.error('Failed to initialize Neon PostgreSQL schema:', error);
    return false;
  }
}

// ==================== NEON USER OPERATIONS ====================

export async function neonInsertUser(user: User): Promise<boolean> {
  if (!isNeonConfigured()) return false;
  try {
    const sql = getNeonSql();
    await sql`
      INSERT INTO users (id, email, password_hash, name, role, status, avatar_url, bio, created_at, updated_at)
      VALUES (
        ${user.id},
        ${user.email.toLowerCase()},
        ${user.passwordHash},
        ${user.name},
        ${user.role},
        ${user.status},
        ${user.avatar || null},
        ${user.bio || null},
        ${user.createdAt},
        ${user.updatedAt}
      )
      ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        password_hash = EXCLUDED.password_hash,
        name = EXCLUDED.name,
        role = EXCLUDED.role,
        status = EXCLUDED.status,
        avatar_url = EXCLUDED.avatar_url,
        bio = EXCLUDED.bio,
        updated_at = EXCLUDED.updated_at;
    `;
    return true;
  } catch (err) {
    console.error('Neon insertUser error:', err);
    return false;
  }
}

export async function neonUpdateUser(id: string, updates: Partial<User>): Promise<boolean> {
  if (!isNeonConfigured()) return false;
  try {
    const sql = getNeonSql();
    const existing = await neonGetUserById(id);
    if (!existing) return false;

    const merged = { ...existing, ...updates, updatedAt: new Date().toISOString() };
    await sql`
      UPDATE users SET
        name = ${merged.name},
        role = ${merged.role},
        status = ${merged.status},
        avatar_url = ${merged.avatar || null},
        bio = ${merged.bio || null},
        updated_at = ${merged.updatedAt}
      WHERE id = ${id};
    `;
    return true;
  } catch (err) {
    console.error('Neon updateUser error:', err);
    return false;
  }
}

export async function neonDeleteUser(id: string): Promise<boolean> {
  if (!isNeonConfigured()) return false;
  try {
    const sql = getNeonSql();
    await sql`DELETE FROM users WHERE id = ${id};`;
    return true;
  } catch (err) {
    console.error('Neon deleteUser error:', err);
    return false;
  }
}

export async function neonGetUserByEmail(email: string): Promise<User | null> {
  if (!isNeonConfigured()) return null;
  try {
    const sql = getNeonSql();
    const rows = await sql`
      SELECT id, email, password_hash as "passwordHash", name, role, status, avatar_url as "avatar", bio, created_at as "createdAt", updated_at as "updatedAt"
      FROM users
      WHERE LOWER(email) = LOWER(${email})
      LIMIT 1;
    `;
    if (!rows || rows.length === 0) return null;
    const r = rows[0];
    return {
      id: r.id,
      email: r.email,
      passwordHash: r.passwordHash,
      name: r.name,
      role: r.role as any,
      status: r.status as any,
      avatar: r.avatar || undefined,
      bio: r.bio || undefined,
      createdAt: new Date(r.createdAt).toISOString(),
      updatedAt: new Date(r.updatedAt).toISOString(),
    };
  } catch (err) {
    console.error('Neon getUserByEmail error:', err);
    return null;
  }
}

export async function neonGetUserById(id: string): Promise<User | null> {
  if (!isNeonConfigured()) return null;
  try {
    const sql = getNeonSql();
    const rows = await sql`
      SELECT id, email, password_hash as "passwordHash", name, role, status, avatar_url as "avatar", bio, created_at as "createdAt", updated_at as "updatedAt"
      FROM users
      WHERE id = ${id}
      LIMIT 1;
    `;
    if (!rows || rows.length === 0) return null;
    const r = rows[0];
    return {
      id: r.id,
      email: r.email,
      passwordHash: r.passwordHash,
      name: r.name,
      role: r.role as any,
      status: r.status as any,
      avatar: r.avatar || undefined,
      bio: r.bio || undefined,
      createdAt: new Date(r.createdAt).toISOString(),
      updatedAt: new Date(r.updatedAt).toISOString(),
    };
  } catch (err) {
    console.error('Neon getUserById error:', err);
    return null;
  }
}

export async function neonGetAllUsers(): Promise<User[]> {
  if (!isNeonConfigured()) return [];
  try {
    const sql = getNeonSql();
    const rows = await sql`
      SELECT id, email, password_hash as "passwordHash", name, role, status, avatar_url as "avatar", bio, created_at as "createdAt", updated_at as "updatedAt"
      FROM users
      ORDER BY created_at DESC;
    `;
    return rows.map((r: any) => ({
      id: r.id,
      email: r.email,
      passwordHash: r.passwordHash,
      name: r.name,
      role: r.role as any,
      status: r.status as any,
      avatar: r.avatar || undefined,
      bio: r.bio || undefined,
      createdAt: new Date(r.createdAt).toISOString(),
      updatedAt: new Date(r.updatedAt).toISOString(),
    }));
  } catch (err) {
    console.error('Neon getAllUsers error:', err);
    return [];
  }
}

// ==================== NEON SESSION OPERATIONS ====================

export async function neonGetSessionByToken(token: string): Promise<Session | null> {
  if (!isNeonConfigured()) return null;
  try {
    const sql = getNeonSql();
    const rows = await sql`
      SELECT id, user_id as "userId", session_token as "sessionToken", expires_at as "expiresAt", created_at as "createdAt"
      FROM sessions
      WHERE session_token = ${token}
      LIMIT 1;
    `;
    if (rows.length === 0) return null;
    const r = rows[0];
    return {
      id: r.id,
      userId: r.userId,
      sessionToken: r.sessionToken,
      expiresAt: new Date(r.expiresAt).toISOString(),
      createdAt: new Date(r.createdAt).toISOString(),
    };
  } catch (err) {
    console.error('Neon getSessionByToken error:', err);
    return null;
  }
}

export async function neonInsertSession(session: Session): Promise<boolean> {
  if (!isNeonConfigured()) return false;
  try {
    const sql = getNeonSql();
    await sql`
      INSERT INTO sessions (id, user_id, session_token, expires_at, created_at)
      VALUES (${session.id}, ${session.userId}, ${session.sessionToken}, ${session.expiresAt}, ${session.createdAt})
      ON CONFLICT (session_token) DO UPDATE SET
        expires_at = EXCLUDED.expires_at;
    `;
    return true;
  } catch (err) {
    console.error('Neon insertSession error:', err);
    return false;
  }
}

export async function neonDeleteSession(token: string): Promise<boolean> {
  if (!isNeonConfigured()) return false;
  try {
    const sql = getNeonSql();
    await sql`DELETE FROM sessions WHERE session_token = ${token};`;
    return true;
  } catch (err) {
    console.error('Neon deleteSession error:', err);
    return false;
  }
}

export async function neonDeleteUserSessions(userId: string): Promise<boolean> {
  if (!isNeonConfigured()) return false;
  try {
    const sql = getNeonSql();
    await sql`DELETE FROM sessions WHERE user_id = ${userId};`;
    return true;
  } catch (err) {
    console.error('Neon deleteUserSessions error:', err);
    return false;
  }
}

// ==================== NEON PROGRESS & LOGS ====================

export async function neonSaveLessonProgress(p: LessonProgress): Promise<boolean> {
  if (!isNeonConfigured()) return false;
  try {
    const sql = getNeonSql();
    await sql`
      INSERT INTO lesson_progress (id, user_id, lesson_id, is_completed, completed_at, created_at, updated_at)
      VALUES (${p.id}, ${p.userId}, ${p.lessonId}, ${p.isCompleted}, ${p.completedAt || null}, ${p.createdAt}, ${p.updatedAt})
      ON CONFLICT (id) DO UPDATE SET
        is_completed = EXCLUDED.is_completed,
        completed_at = EXCLUDED.completed_at,
        updated_at = EXCLUDED.updated_at;
    `;
    return true;
  } catch (err) {
    console.error('Neon saveLessonProgress error:', err);
    return false;
  }
}

export async function neonSaveQuizAttempt(q: QuizAttempt): Promise<boolean> {
  if (!isNeonConfigured()) return false;
  try {
    const sql = getNeonSql();
    await sql`
      INSERT INTO quiz_attempts (id, user_id, quiz_id, score, passed, answers_json, completed_at)
      VALUES (${q.id}, ${q.userId}, ${q.quizId}, ${q.score}, ${q.passed}, ${JSON.stringify(q.userAnswers || {})}::jsonb, ${q.createdAt || new Date().toISOString()})
      ON CONFLICT (id) DO NOTHING;
    `;
    return true;
  } catch (err) {
    console.error('Neon saveQuizAttempt error:', err);
    return false;
  }
}

export async function neonRecordAuditLog(log: AuditLog): Promise<boolean> {
  if (!isNeonConfigured()) return false;
  try {
    const sql = getNeonSql();
    const details = `${log.action} on ${log.resource || 'System'}${log.resourceId ? ` (${log.resourceId})` : ''}: ${JSON.stringify(log.metadata || {})}`;
    await sql`
      INSERT INTO audit_logs (id, user_id, action, details, timestamp)
      VALUES (${log.id}, ${log.userId || null}, ${log.action}, ${details}, ${log.timestamp});
    `;
    return true;
  } catch (err) {
    console.error('Neon recordAuditLog error:', err);
    return false;
  }
}

// ==================== NEON DATABASE STATS & SYNC ====================

export interface DatabaseStats {
  isConfigured: boolean;
  type: 'Neon PostgreSQL' | 'Embedded Local Storage';
  connectionUrlMasked?: string;
  tables: {
    users: number;
    sessions: number;
    lessons: number;
    quizzes: number;
    quizAttempts: number;
    lessonProgress: number;
    auditLogs: number;
  };
  lastSyncAt: string;
}

export async function getDatabaseStats(localCounts: {
  users: number;
  sessions: number;
  lessons: number;
  quizzes: number;
  quizAttempts: number;
  lessonProgress: number;
  auditLogs: number;
}): Promise<DatabaseStats> {
  const isConfigured = isNeonConfigured();
  if (!isConfigured) {
    return {
      isConfigured: false,
      type: 'Embedded Local Storage',
      tables: localCounts,
      lastSyncAt: new Date().toISOString(),
    };
  }

  const rawUrl = getDatabaseUrl() || '';
  const maskedUrl = rawUrl.replace(/\/\/[^:]+:[^@]+@/, '//***:***@');

  try {
    const sql = getNeonSql();
    await initNeonSchema();

    const [uCount, sCount, lCount, qCount, qaCount, lpCount, aCount] = await Promise.all([
      sql`SELECT count(*)::int as count FROM users;`,
      sql`SELECT count(*)::int as count FROM sessions;`,
      sql`SELECT count(*)::int as count FROM lessons;`,
      sql`SELECT count(*)::int as count FROM quizzes;`,
      sql`SELECT count(*)::int as count FROM quiz_attempts;`,
      sql`SELECT count(*)::int as count FROM lesson_progress;`,
      sql`SELECT count(*)::int as count FROM audit_logs;`,
    ]);

    return {
      isConfigured: true,
      type: 'Neon PostgreSQL',
      connectionUrlMasked: maskedUrl,
      tables: {
        users: uCount[0]?.count || 0,
        sessions: sCount[0]?.count || 0,
        lessons: lCount[0]?.count || 0,
        quizzes: qCount[0]?.count || 0,
        quizAttempts: qaCount[0]?.count || 0,
        lessonProgress: lpCount[0]?.count || 0,
        auditLogs: aCount[0]?.count || 0,
      },
      lastSyncAt: new Date().toISOString(),
    };
  } catch (err) {
    console.error('Failed to query Neon PostgreSQL stats:', err);
    return {
      isConfigured: true,
      type: 'Neon PostgreSQL',
      connectionUrlMasked: maskedUrl,
      tables: localCounts,
      lastSyncAt: new Date().toISOString(),
    };
  }
}
