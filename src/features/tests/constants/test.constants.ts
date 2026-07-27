import type { TestType, DifficultyLevel, MarkingScheme } from '../types';

/**
 * Test-module-only constants.
 *
 * Global constants remain in `src/constants/`.
 * Everything here is scoped to the Test feature.
 */

// ── Test type options (tab component) ────────────────────

export const TEST_TYPES: readonly { label: string; value: TestType }[] = [
  { label: 'Chapterwise', value: 'chapterwise' },
  { label: 'PYQ', value: 'pyq' },
  { label: 'Mock Test', value: 'mock-test' },
] as const;

// ── Difficulty level options (radio group) ───────────────

export const DIFFICULTY_LEVELS: readonly { label: string; value: DifficultyLevel }[] = [
  { label: 'Easy', value: 'easy' },
  { label: 'Medium', value: 'medium' },
  { label: 'Difficult', value: 'difficult' },
] as const;

// ── Default marking scheme ───────────────────────────────

export const DEFAULT_MARKING_SCHEME: MarkingScheme = {
  wrongAnswer: -1,
  unattempted: 0,
  correctAnswer: 5,
} as const;

// ── Form constraints ─────────────────────────────────────

export const TEST_LIMITS = {
  MIN_DURATION: 1,
  MAX_DURATION: 300,
  MIN_QUESTIONS: 1,
  MAX_QUESTIONS: 500,
} as const;

// ── Default form values ──────────────────────────────────

export const TEST_FORM_DEFAULTS = {
  testType: 'chapterwise' as TestType,
  subject: '',
  title: '',
  topic: '',
  subTopic: '',
  duration: 0,
  difficultyLevel: 'easy' as DifficultyLevel,
  markingScheme: { ...DEFAULT_MARKING_SCHEME },
  totalQuestions: 0,
} as const;

// ── User-facing messages ─────────────────────────────────

export const TEST_MESSAGES = {
  CREATE: {
    SUCCESS: 'Test created successfully',
    ERROR: 'Failed to create test. Please try again.',
  },
  UPDATE: {
    SUCCESS: 'Test updated successfully',
    ERROR: 'Failed to update test. Please try again.',
  },
  DELETE: {
    SUCCESS: 'Test deleted successfully',
    ERROR: 'Failed to delete test. Please try again.',
  },
  FETCH: {
    ERROR: 'Failed to load tests. Please try again.',
  },
  VALIDATION: {
    REQUIRED_SUBJECT: 'Subject is required',
    REQUIRED_TITLE: 'Name of Test is required',
    REQUIRED_TOPIC: 'Topic is required',
    REQUIRED_DURATION: 'Duration is required',
    INVALID_DURATION: 'Duration must be a positive number',
  },
} as const;
