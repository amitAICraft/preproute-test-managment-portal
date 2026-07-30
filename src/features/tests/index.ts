// Test feature — public API.

// Types
export type {
  Test,
  TestType,
  TestStatus,
  DifficultyLevel,
  MarkingScheme,
  CreateTestRequest,
  UpdateTestRequest,
  TestListParams,
  PaginatedTests,
} from './types';

// Schemas
export { createTestSchema, updateTestSchema } from './schemas';
export type { CreateTestFormValues, UpdateTestFormValues } from './schemas';

// API hooks (RTK Query generated)
export {
  useGetTestsQuery,
  useGetTestByIdQuery,
  useCreateTestMutation,
  useUpdateTestMutation,
} from './api';

// Business logic hooks
export { useTests, useTest, useCreateTest, useUpdateTest } from './hooks';

// Constants
export {
  TEST_TYPES,
  DIFFICULTY_LEVELS,
  DEFAULT_MARKING_SCHEME,
  TEST_LIMITS,
  TEST_FORM_DEFAULTS,
  TEST_MESSAGES,
  DASHBOARD_MESSAGES,
  TEST_STATUS_BADGE_VARIANT,
} from './constants';
export type { TestStatusBadgeVariant } from './constants';

// Pages
export * from './pages/CreateTestPage';
export * from './pages/QuestionBuilderPage';
export * from './pages/PublishTestPage';
