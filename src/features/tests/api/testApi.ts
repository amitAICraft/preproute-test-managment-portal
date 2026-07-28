import { baseApi } from '@/services/baseApi';
import type { ApiResponse } from '@/types';
import type {
  Test,
  CreateTestRequest,
  UpdateTestRequest,
  TestListParams,
  PaginatedTests,
} from '../types';

/**
 * Test API — RTK Query endpoints injected into the shared `baseApi`.
 *
 * Implements:
 *   GET  /tests       → paginated list
 *   GET  /tests/:id   → single test
 *   POST /tests       → create test
 *   PUT  /tests/:id   → update test (full replacement)
 *
 * Uses `transformResponse` to unwrap the `ApiResponse<T>` envelope,
 * consistent with the pattern established in `authApi`.
 */
// ── Mapping Helpers ──────────────────────────────────────

const mapBackendToFrontendTest = (backendTest: any): Test => ({
  id: backendTest.id,
  testType: backendTest.type || 'chapterwise',
  subject: backendTest.subject,
  title: backendTest.name,
  topic: backendTest.topics?.[0] || '',
  subTopic: backendTest.sub_topics?.[0] || '',
  duration: backendTest.total_time || 0,
  difficultyLevel: backendTest.difficulty || 'easy',
  markingScheme: {
    wrongAnswer: backendTest.wrong_marks || -1,
    unattempted: backendTest.unattempt_marks || 0,
    correctAnswer: backendTest.correct_marks || 5,
  },
  totalQuestions: backendTest.total_questions || 0,
  totalMarks: backendTest.total_marks || 0,
  status: backendTest.status || 'draft',
  createdAt: backendTest.created_at || new Date().toISOString(),
  updatedAt: backendTest.updated_at || new Date().toISOString(),
});

const mapFrontendToBackendRequest = (frontendReq: CreateTestRequest | UpdateTestRequest) => ({
  name: frontendReq.title,
  type: frontendReq.testType,
  subject: frontendReq.subject,
  topics: [frontendReq.topic].filter(Boolean),
  sub_topics: frontendReq.subTopic ? [frontendReq.subTopic] : [],
  correct_marks: frontendReq.markingScheme.correctAnswer,
  wrong_marks: frontendReq.markingScheme.wrongAnswer,
  unattempt_marks: frontendReq.markingScheme.unattempted,
  difficulty: frontendReq.difficultyLevel,
  total_time: frontendReq.duration,
  total_marks: (frontendReq as any).totalMarks || (frontendReq.totalQuestions * frontendReq.markingScheme.correctAnswer),
  total_questions: frontendReq.totalQuestions,
  status: 'draft',
});

export const testApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── GET /tests ─────────────────────────────────────────
    getTests: builder.query<PaginatedTests, TestListParams | void>({
      query: (params) => ({
        url: '/tests',
        params: params ?? undefined,
      }),
      transformResponse: (response: ApiResponse<any[]>) => {
        const mappedData = response.data.map(mapBackendToFrontendTest);
        return {
          data: mappedData,
          total: mappedData.length,
          page: 1,
          limit: mappedData.length,
          totalPages: 1,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Test' as const, id })),
              { type: 'Test', id: 'LIST' },
            ]
          : [{ type: 'Test', id: 'LIST' }],
    }),

    // ── GET /tests/:id ────────────────────────────────────
    getTestById: builder.query<Test, string>({
      query: (id) => `/tests/${id}`,
      transformResponse: (response: ApiResponse<any>) => mapBackendToFrontendTest(response.data),
      providesTags: (_result, _error, id) => [{ type: 'Test', id }],
    }),

    // ── POST /tests ───────────────────────────────────────
    createTest: builder.mutation<Test, CreateTestRequest>({
      query: (body) => ({
        url: '/tests',
        method: 'POST',
        body: mapFrontendToBackendRequest(body),
      }),
      transformResponse: (response: ApiResponse<any>) => mapBackendToFrontendTest(response.data),
      invalidatesTags: [{ type: 'Test', id: 'LIST' }],
    }),

    // ── PUT /tests/:id ────────────────────────────────────
    updateTest: builder.mutation<Test, UpdateTestRequest>({
      query: ({ id, ...body }) => ({
        url: `/tests/${id}`,
        method: 'PUT',
        body: mapFrontendToBackendRequest(body as UpdateTestRequest),
      }),
      transformResponse: (response: ApiResponse<any>) => mapBackendToFrontendTest(response.data),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Test', id },
        { type: 'Test', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetTestsQuery,
  useGetTestByIdQuery,
  useCreateTestMutation,
  useUpdateTestMutation,
} = testApi;
