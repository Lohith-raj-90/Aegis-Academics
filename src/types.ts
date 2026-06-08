/**
 * Aegis Academics Type Declarations
 */

export type TabType = 'dashboard' | 'attendance' | 'planner' | 'resources' | 'quiz' | 'chat';

export interface UserProfile {
  name: string;
  email: string;
  badge: 'Sovereign Scholar' | 'Sage Practitioner' | 'Apprentice Scholar';
  avatarUrl: string;
  readinessScore: number;
}

export interface ExamTask {
  id: string;
  subject: string;
  topic: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  duration: string;
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
}

export interface UnscheduledTarget {
  id: string;
  subject: string;
  topic: string;
  estimatedHours: number;
}

export interface LibraryResource {
  id: string;
  title: string;
  category: 'Mathematics' | 'Computer Science' | 'Engineering' | 'Physics';
  fileSize: string;
  synced: boolean;
  abstract: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

export interface QuizSession {
  type: 'multiple-choice' | 'flashcards' | 'short-answer' | 'technical';
  title: string;
  questions: QuizQuestion[];
  currentIndex: number;
  score: number;
  completed: boolean;
  userAnswers: Record<string, string>;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
