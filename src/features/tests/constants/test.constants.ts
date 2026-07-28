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

export const SUBJECT_OPTIONS = [
  { label: 'Physics', value: 'physics' },
  { label: 'Chemistry', value: 'chemistry' },
  { label: 'Mathematics', value: 'mathematics' },
] as const;

export const TOPIC_OPTIONS = [
  { label: 'Kinematics', value: 'kinematics' },
  { label: 'Thermodynamics', value: 'thermodynamics' },
  { label: 'Optics', value: 'optics' },
] as const;

export const SUB_TOPIC_OPTIONS = [
  { label: '1D Motion', value: '1d-motion' },
  { label: '2D Motion', value: '2d-motion' },
] as const;

export const CREATE_TEST_ACTIONS = {
  CANCEL: 'Cancel',
  NEXT: 'Next',
  SAVING: 'Saving...',
} as const;

export const TEST_FORM_CONSTANTS = {
  TITLE: 'Edit Test creation',
  SAVE: 'Save',
  CANCEL: 'Cancel',
  SAVING: 'Saving...',
  LABELS: {
    SUBJECT: 'Subject',
    NAME_OF_TEST: 'Name of Test',
    TOPIC: 'Topic',
    SUB_TOPIC: 'Sub Topic',
    DURATION: 'Duration (Minutes)',
    DIFFICULTY: 'Test Difficulty Level',
    MARKING_SCHEME: 'Marking Scheme:',
    WRONG_ANSWER: 'Wrong Answer',
    UNATTEMPTED: 'Unattempted',
    CORRECT_ANSWER: 'Correct Answer',
    NO_OF_QUESTIONS: 'No of Questions',
    TOTAL_MARKS: 'Total Marks',
  },
  PLACEHOLDERS: {
    DROPDOWN: 'Choose from Drop-down',
    TEST_NAME: 'Enter name of Test',
    DURATION: 'Enter the time',
    WRONG_ANSWER: '-1',
    UNATTEMPTED: '+0',
    CORRECT_ANSWER: '+5',
    QUESTIONS: 'Ex:250 Marks',
    MARKS: 'Ex:250 Marks',
  },
} as const;

// ── Dashboard strings ─────────────────────────────────────

export const DASHBOARD_MESSAGES = {
  PAGE_TITLE: 'Dashboard',
  PAGE_DESCRIPTION: 'Manage and track all your tests.',
  CREATE_BUTTON: 'Create New Test',
  LOADING_LABEL: 'Loading tests…',
  EMPTY_TITLE: 'No tests found',
  EMPTY_DESCRIPTION: "You haven't created any tests yet. Click the button above to get started.",
  ERROR_TITLE: 'Failed to load tests',
  ERROR_FALLBACK: 'An unexpected error occurred while fetching your tests.',
  TABLE: {
    COL_NAME: 'Test Name',
    COL_SUBJECT: 'Subject',
    COL_STATUS: 'Status',
    COL_DATE: 'Created Date',
    COL_ACTIONS: 'Actions',
    NO_SUBJECT: '—',
  },
  ACTIONS: {
    VIEW: 'View test',
    EDIT: 'Edit test',
    DELETE: 'Delete test',
    DELETE_UNAVAILABLE: 'Delete is not available',
  },
} as const;

// ── Status → Badge variant map ────────────────────────────
// Kept here (constants layer) so the component stays logic-free.

export const TEST_STATUS_BADGE_VARIANT = {
  published: 'success',
  draft: 'warning',
  archived: 'secondary',
} as const satisfies Record<string, 'success' | 'warning' | 'secondary'>;

export type TestStatusBadgeVariant = (typeof TEST_STATUS_BADGE_VARIANT)[keyof typeof TEST_STATUS_BADGE_VARIANT];
