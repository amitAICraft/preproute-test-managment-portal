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
export const testApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── GET /tests ─────────────────────────────────────────
    getTests: builder.query<PaginatedTests, TestListParams | void>({
      query: (params) => ({
        url: '/tests',
        params: params ?? undefined,
      }),
      transformResponse: (response: ApiResponse<PaginatedTests>) => response.data,
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
      transformResponse: (response: ApiResponse<Test>) => response.data,
      providesTags: (_result, _error, id) => [{ type: 'Test', id }],
    }),

    // ── POST /tests ───────────────────────────────────────
    createTest: builder.mutation<Test, CreateTestRequest>({
      query: (body) => ({
        url: '/tests',
        method: 'POST',
        body,
      }),
      transformResponse: (response: ApiResponse<Test>) => response.data,
      invalidatesTags: [{ type: 'Test', id: 'LIST' }],
    }),

    // ── PUT /tests/:id ────────────────────────────────────
    updateTest: builder.mutation<Test, UpdateTestRequest>({
      query: ({ id, ...body }) => ({
        url: `/tests/${id}`,
        method: 'PUT',
        body,
      }),
      transformResponse: (response: ApiResponse<Test>) => response.data,
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
