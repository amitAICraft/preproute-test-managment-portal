/**
 * Test feature — TypeScript models.
 *
 * All types are derived from the API documentation and Figma designs.
 * Feature-scoped: imported via `@/features/tests/types`.
 */

// ── Enums (union types) ─────────────────────────────────

/** Test category tabs visible in the Create/Edit forms. */
export type TestType = 'chapterwise' | 'pyq' | 'mock-test';

/** Lifecycle status managed by the backend. */
export type TestStatus = 'draft' | 'published' | 'archived';

/** Difficulty radio options in the Create/Edit forms. */
export type DifficultyLevel = 'easy' | 'medium' | 'difficult';

// ── Nested models ────────────────────────────────────────

/** Marking scheme configuration for a test. */
export interface MarkingScheme {
  wrongAnswer: number;
  unattempted: number;
  correctAnswer: number;
}

// ── Core entity ──────────────────────────────────────────

/** Full Test entity returned by the API. */
export interface Test {
  id: string;
  testType: TestType;
  subject: string;
  title: string;
  topic: string;
  subTopic?: string;
  duration: number;
  difficultyLevel: DifficultyLevel;
  markingScheme: MarkingScheme;
  totalQuestions: number;
  totalMarks: number;
  status: TestStatus;
  createdAt: string;
  updatedAt: string;
}

// ── Request payloads ─────────────────────────────────────

/** Payload for `POST /tests`. */
export interface CreateTestRequest {
  testType: TestType;
  subject: string;
  title: string;
  topic: string;
  subTopic?: string;
  duration: number;
  difficultyLevel: DifficultyLevel;
  markingScheme: MarkingScheme;
  totalQuestions: number;
}

/** Payload for `PUT /tests/:id`. */
export interface UpdateTestRequest {
  id: string;
  testType: TestType;
  subject: string;
  title: string;
  topic: string;
  subTopic?: string;
  duration: number;
  difficultyLevel: DifficultyLevel;
  markingScheme: MarkingScheme;
  totalQuestions: number;
}

// ── Query params ─────────────────────────────────────────

/** Query parameters for `GET /tests`. */
export interface TestListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: TestStatus;
}

// ── Paginated response ───────────────────────────────────

/** Paginated list returned by `GET /tests`. */
export interface PaginatedTests {
  data: Test[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
