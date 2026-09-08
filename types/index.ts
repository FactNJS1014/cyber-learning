export type Role = 'STUDENT' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'DISABLED';
export type QuestionType = 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SCENARIO_BASED';
export type SubmissionStatus = 'PENDING' | 'GRADED' | 'REJECTED';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  status: UserStatus;
  avatar?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  id: string;
  userId: string;
  sessionToken: string;
  expiresAt: string;
  createdAt: string;
}

export interface Level {
  id: string;
  name: string;
  slug: string;
  description: string;
  order: number;
  badgeName?: string;
}

export interface Course {
  id: string;
  levelId: string;
  title: string;
  slug: string;
  description: string;
  icon?: string;
  order: number;
  lessons?: Lesson[];
}

export interface QuizOption {
  key: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  quizId: string;
  question: string;
  questionType: QuestionType;
  order: number;
  explanation: string;
  correctAnswer: string;
  options: QuizOption[];
}

export interface Quiz {
  id: string;
  lessonId: string;
  title: string;
  passingScore: number; // e.g. 70
  status: 'PUBLISHED' | 'DRAFT';
  questions: QuizQuestion[];
  createdAt?: string;
  updatedAt?: string;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  userAnswers: Record<string, string>; // questionId -> selected option
  reviewDetails?: {
    questionId: string;
    question: string;
    selectedAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  createdAt: string;
}

export interface TerminalCommand {
  command: string;
  output: string;
  hint?: string;
}

export interface LabStep {
  title: string;
  instruction: string;
  hint?: string;
}

export interface Lab {
  id: string;
  lessonId?: string;
  title: string;
  slug: string;
  description?: string;
  difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  estimatedMinutes?: number;
  environmentTarget?: string;
  objective: string;
  environment: string;
  prerequisites: string;
  stepByStep: string;
  expectedResult: string;
  securityExplanation: string;
  mitigation: string;
  scenarioType: 'web' | 'network' | 'recon' | 'cryptography' | 'defensive' | 'pentest';
  terminalCommands?: TerminalCommand[];
  sampleInputTarget?: string;
  steps?: LabStep[];
  solutionGuide?: string;
}

export type SecurityLab = Lab;

export interface LabProgress {
  id: string;
  userId: string;
  labId: string;
  isCompleted: boolean;
  notes?: string;
  completedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  slug: string;
  level: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';
  description: string;
  learningObjective: string;
  content: string;
  labContent?: string;
  order: number;
  status: 'PUBLISHED' | 'DRAFT';
  durationMinutes: number;
  quiz?: Quiz;
  lab?: Lab;
  createdAt?: string;
  updatedAt?: string;
}

export interface LessonProgress {
  id: string;
  userId: string;
  lessonId: string;
  isCompleted: boolean;
  completedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FinalProject {
  id: string;
  title: string;
  description: string;
  scope: string;
  instructions: string;
  rubric: {
    category: string;
    maxPoints: number;
    description: string;
  }[];
  passingScore: number;
}

export interface ProjectSubmission {
  id: string;
  userId: string;
  projectId: string;
  title: string;
  description: string;
  testingScope: string;
  methodology: string;
  findings: string;
  recommendations: string;
  reportUrl?: string;
  score?: number;
  scoreBreakdown?: Record<string, number>;
  feedback?: string;
  status: SubmissionStatus;
  gradedAt?: string;
  createdAt: string;
  userName?: string;
  userEmail?: string;
}

export interface Certificate {
  id: string;
  userId: string;
  certificateNo: string;
  programName: string;
  level: string;
  issuedAt: string;
  verificationCode: string;
  userName?: string;
}

export interface Achievement {
  id: string;
  code: string;
  title: string;
  description: string;
  icon: string;
  criteria: string;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  unlockedAt: string;
  achievement?: Achievement;
}

export interface Bookmark {
  id: string;
  userId: string;
  lessonId: string;
  createdAt: string;
}

export interface Note {
  id: string;
  userId: string;
  lessonId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface LearningActivity {
  id: string;
  userId: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface AuditLog {
  id: string;
  userId?: string;
  userName?: string;
  action: string;
  resource: string;
  resourceId?: string;
  metadata?: any;
  timestamp: string;
}
