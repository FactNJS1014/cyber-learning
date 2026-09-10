import { QuizQuestion } from '@/types';
import { basicQuizzesData } from './quizDataPart1';
import { intermediateQuizzesData } from './quizDataPart2';
import { advancedQuizzesData } from './quizDataPart3';

export const lessonQuizzesData: Record<string, Omit<QuizQuestion, 'id' | 'quizId'>[]> = {
  ...basicQuizzesData,
  ...intermediateQuizzesData,
  ...advancedQuizzesData,
};

export function getQuestionsForLesson(lessonId: string): Omit<QuizQuestion, 'id' | 'quizId'>[] {
  if (lessonQuizzesData[lessonId]) {
    return lessonQuizzesData[lessonId];
  }
  // Fallback to basic lesson 1-1 if not found
  return lessonQuizzesData['lesson-b1-1'] || [];
}
