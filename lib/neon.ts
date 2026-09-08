import { neon, Pool } from '@neondatabase/serverless';

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
