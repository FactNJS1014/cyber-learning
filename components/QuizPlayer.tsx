'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Award,
  ShieldCheck,
  AlertCircle,
  BookOpen
} from 'lucide-react';
import ProgressBar from './ProgressBar';

interface QuizQuestion {
  id: string;
  order: number;
  question: string;
  questionType: string;
  options: { key: string; text: string }[];
}

interface QuizData {
  id: string;
  lessonId: string;
  title: string;
  passingScore: number;
  totalQuestions: number;
  questions: QuizQuestion[];
}

interface ReviewDetail {
  questionId: string;
  question: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
}

interface QuizResult {
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  correctCount: number;
  incorrectCount: number;
  reviewDetails: ReviewDetail[];
}

interface QuizPlayerProps {
  quizId: string;
  lessonId: string;
  lessonTitle?: string;
}

export default function QuizPlayer({ quizId, lessonId, lessonTitle }: QuizPlayerProps) {
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State during quiz
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [showReview, setShowReview] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function loadQuiz() {
      try {
        const res = await fetch(`/api/quiz/${quizId}`);
        if (!res.ok) {
          if (res.status === 401) {
            if (isMounted) {
              setError('กรุณาสมัครสมาชิกหรือเข้าสู่ระบบก่อนเริ่มทำแบบทดสอบ');
              setLoading(false);
            }
            return;
          }
          throw new Error('Failed to load quiz');
        }
        const data = await res.json();
        if (isMounted) {
          setQuiz(data.quiz);
          setLoading(false);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Error loading quiz');
          setLoading(false);
        }
      }
    }

    loadQuiz();

    return () => {
      isMounted = false;
    };
  }, [quizId]);

  useEffect(() => {
    let timer: any;
    if (quiz && !result) {
      timer = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [quiz, result]);

  const handleSelectOption = (questionId: string, optionKey: string) => {
    if (result) return; // Cannot change after submission
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionKey,
    }));
  };

  const handleSubmitQuiz = async () => {
    if (!quiz) return;

    // Check unanswered
    const unanswered = quiz.questions.filter((q) => !selectedAnswers[q.id]);
    if (unanswered.length > 0) {
      const confirmSubmit = window.confirm(
        `You have ${unanswered.length} unanswered questions. Are you sure you want to submit the quiz?`
      );
      if (!confirmSubmit) return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quizId: quiz.id,
          answers: selectedAnswers,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to grade quiz');
      }

      const data: QuizResult = await res.json();
      setResult(data);

      if (data.passed) {
        try {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#06b6d4', '#10b981', '#3b82f6', '#f59e0b'],
          });
        } catch (e) {}
      }
    } catch (err: any) {
      alert(err.message || 'Error submitting quiz');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetake = () => {
    setResult(null);
    setShowReview(false);
    setSelectedAnswers({});
    setCurrentIndex(0);
    setSecondsElapsed(0);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <div className="h-10 w-10 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-mono text-slate-400">กำลังโหลดชุดแบบทดสอบ 20 ข้อ (Loading Quiz Engine)...</p>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="p-8 max-w-xl mx-auto rounded-xl bg-slate-900 border border-red-500/30 text-center space-y-4">
        <AlertCircle className="h-12 w-12 text-red-400 mx-auto" />
        <h3 className="text-lg font-bold text-white">ไม่สามารถเปิดแบบทดสอบได้</h3>
        <p className="text-sm text-slate-400">{error || 'ไม่พบคำถามสำหรับบทเรียนนี้'}</p>
        <div className="pt-2">
          <Link
            href="/login"
            className="inline-flex items-center px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 font-semibold text-xs"
          >
            ไปที่หน้าเข้าสู่ระบบ (Go to Login)
          </Link>
        </div>
      </div>
    );
  }

  const currentQ = quiz.questions[currentIndex];
  const answeredCount = Object.keys(selectedAnswers).length;

  // ==================== RESULT VIEW ====================
  if (result) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
        {/* Result Header Card */}
        <div
          className={`relative overflow-hidden rounded-2xl border p-6 sm:p-8 text-center backdrop-blur-md ${
            result.passed
              ? 'bg-gradient-to-b from-emerald-950/40 via-slate-900 to-slate-950 border-emerald-500/40 shadow-[0_0_40px_rgba(16,185,129,0.15)]'
              : 'bg-gradient-to-b from-red-950/40 via-slate-900 to-slate-950 border-red-500/40 shadow-[0_0_40px_rgba(239,68,68,0.15)]'
          }`}
        >
          <div className="flex flex-col items-center space-y-4">
            <div
              className={`h-16 w-16 rounded-2xl border flex items-center justify-center ${
                result.passed
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
                  : 'bg-red-500/20 border-red-500/50 text-red-400'
              }`}
            >
              {result.passed ? <CheckCircle2 className="h-9 w-9" /> : <XCircle className="h-9 w-9" />}
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-slate-400">
                ━━━━━━━━ ผลการทดสอบ (QUIZ RESULT) ━━━━━━━━
              </span>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                {result.passed ? '✓ ผ่านเกณฑ์ประเมิน (PASSED)' : '✕ ไม่ผ่านเกณฑ์ (FAILED)'}
              </h2>
              <p className="text-xs font-mono text-slate-400">
                เกณฑ์การผ่าน: 70% (ต้องตอบถูกอย่างน้อย 14 จาก 20 ข้อ)
              </p>
            </div>

            {/* Score Numbers */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-lg pt-3">
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase">คะแนน (Score)</span>
                <p className="text-xl font-bold font-mono text-white">
                  {result.score} / {result.totalQuestions}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase">ร้อยละ (%)</span>
                <p
                  className={`text-xl font-bold font-mono ${
                    result.passed ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {result.percentage}%
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase">ตอบถูก (Correct)</span>
                <p className="text-xl font-bold font-mono text-emerald-400">{result.correctCount}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase">ตอบผิด (Incorrect)</span>
                <p className="text-xl font-bold font-mono text-red-400">{result.incorrectCount}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <button
                onClick={() => setShowReview(!showReview)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all border border-slate-700"
              >
                {showReview ? 'ซ่อนเฉลย (Hide Review)' : 'ดูเฉลยคำตอบ (Review Answers)'}
              </button>

              <button
                onClick={handleRetake}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-400 text-xs font-bold transition-all border border-cyan-500/30"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                ทำแบบทดสอบใหม่ (Try Again)
              </button>

              <Link
                href={`/lessons/${lessonId}`}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
              >
                <BookOpen className="h-3.5 w-3.5" />
                กลับไปที่บทเรียน (Back to Lesson)
              </Link>
            </div>
          </div>
        </div>

        {/* Detailed Question Review */}
        {showReview && result.reviewDetails && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-cyan-400" />
              เฉลยและวิเคราะห์ข้อคำถามอย่างละเอียด (20 Questions)
            </h3>

            <div className="space-y-3">
              {result.reviewDetails.map((item, idx) => (
                <div
                  key={item.questionId}
                  className={`p-4 rounded-xl border ${
                    item.isCorrect
                      ? 'bg-slate-900/60 border-emerald-500/30'
                      : 'bg-slate-900/60 border-red-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-mono font-semibold text-slate-400">
                        คำถามข้อที่ {idx + 1}
                      </span>
                      <p className="text-sm font-medium text-slate-100">{item.question}</p>
                    </div>
                    <span
                      className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        item.isCorrect
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-red-500/20 text-red-300'
                      }`}
                    >
                      {item.isCorrect ? 'ถูกต้อง (Correct)' : 'ไม่ถูกต้อง (Incorrect)'}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2 rounded bg-slate-950/80 border border-slate-800">
                      <span className="text-slate-500">คำตอบที่คุณเลือก: </span>
                      <span className={item.isCorrect ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                        {item.selectedAnswer || 'ไม่ได้ตอบ (Unanswered)'}
                      </span>
                    </div>
                    <div className="p-2 rounded bg-slate-950/80 border border-slate-800">
                      <span className="text-slate-500">คำตอบที่ถูกต้อง: </span>
                      <span className="text-emerald-400 font-bold">{item.correctAnswer}</span>
                    </div>
                  </div>

                  {item.explanation && (
                    <div className="mt-2.5 p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
                      <strong className="text-cyan-400 font-mono">คำอธิบาย (Explanation): </strong>
                      {item.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==================== ACTIVE QUIZ VIEW ====================
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Quiz Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
            แบบประเมินความรู้ประจำบทเรียน (20 Questions)
          </span>
          <h2 className="text-base font-bold text-white">{quiz.title}</h2>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-slate-300 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <Clock className="h-3.5 w-3.5 text-cyan-400" />
            <span>{formatTime(secondsElapsed)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>
              ตอบแล้ว {answeredCount}/{quiz.questions.length} ข้อ
            </span>
          </div>
        </div>
      </div>

      {/* 20-Question Matrix Navigation */}
      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono text-slate-400 font-semibold uppercase">
            แถบเลือกข้อคำถาม (Question 1 to 20)
          </span>
          <span className="text-[11px] font-mono text-cyan-400 font-bold">
            เกณฑ์ผ่าน: ≥14/20 ข้อ (70%)
          </span>
        </div>
        <div className="grid grid-cols-10 sm:grid-cols-20 gap-1.5">
          {quiz.questions.map((q, idx) => {
            const isAnswered = !!selectedAnswers[q.id];
            const isCurrent = idx === currentIndex;
            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`h-8 rounded text-xs font-mono font-bold transition-all ${
                  isCurrent
                    ? 'bg-cyan-500 text-slate-950 ring-2 ring-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]'
                    : isAnswered
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:bg-slate-800'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Question Box */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <span className="text-xs font-mono text-cyan-400 font-bold tracking-wider uppercase">
            คำถามข้อที่ {currentIndex + 1} จาก {quiz.questions.length}
          </span>
          <span className="text-xs font-mono text-slate-400 uppercase">{currentQ.questionType}</span>
        </div>

        <h3 className="text-lg sm:text-xl font-semibold text-white leading-relaxed">
          {currentQ.question}
        </h3>

        {/* Options List */}
        <div className="space-y-3">
          {currentQ.options.map((opt) => {
            const isSelected = selectedAnswers[currentQ.id] === opt.key;
            return (
              <button
                key={opt.key}
                onClick={() => handleSelectOption(currentQ.id, opt.key)}
                className={`w-full flex items-center gap-3.5 p-4 rounded-xl text-left transition-all border ${
                  isSelected
                    ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                    : 'bg-slate-950/80 border-slate-800/80 text-slate-300 hover:bg-slate-800/60 hover:border-slate-700'
                }`}
              >
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-mono font-bold border transition-colors ${
                    isSelected
                      ? 'bg-cyan-500 border-cyan-400 text-slate-950'
                      : 'bg-slate-900 border-slate-700 text-slate-400'
                  }`}
                >
                  {opt.key}
                </div>
                <span className="text-sm font-medium leading-relaxed">{opt.text}</span>
              </button>
            );
          })}
        </div>

        {/* Bottom Pagination & Submit */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-800">
          <button
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-slate-300 hover:text-white bg-slate-950 border border-slate-800 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            ข้อก่อนหน้า (Previous)
          </button>

          {currentIndex < quiz.questions.length - 1 ? (
            <button
              onClick={() => setCurrentIndex((prev) => Math.min(quiz.questions.length - 1, prev + 1))}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-xs font-bold text-slate-950 bg-cyan-500 hover:bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all"
            >
              ข้อถัดไป (Next)
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              onClick={handleSubmitQuiz}
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-lg text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'กำลังส่งตรวจคะแนน...' : 'ส่งคำตอบแบบทดสอบ (Submit Quiz)'}
              <CheckCircle2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
