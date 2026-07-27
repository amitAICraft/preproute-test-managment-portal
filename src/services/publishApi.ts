import { baseApi } from './baseApi';

// ── Types ────────────────────────────────────────────────
export interface PublishRequest {
  testId: string;
}

export interface PublishResponse {
  testId: string;
  publishedAt: string;
  shareUrl: string;
}

export interface UnpublishRequest {
  testId: string;
}

// ── Injected endpoints ───────────────────────────────────
export const publishApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    publishTest: builder.mutation<PublishResponse, PublishRequest>({
      query: ({ testId }) => ({
        url: `/tests/${testId}/publish`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, { testId }) => [
        { type: 'Publish', id: testId },
        { type: 'Test', id: testId },
      ],
    }),

    unpublishTest: builder.mutation<void, UnpublishRequest>({
      query: ({ testId }) => ({
        url: `/tests/${testId}/unpublish`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, { testId }) => [
        { type: 'Publish', id: testId },
        { type: 'Test', id: testId },
      ],
    }),

    getPublishStatus: builder.query<PublishResponse, string>({
      query: (testId) => `/tests/${testId}/publish`,
      providesTags: (_result, _error, testId) => [{ type: 'Publish', id: testId }],
    }),
  }),
});

export const {
  usePublishTestMutation,
  useUnpublishTestMutation,
  useGetPublishStatusQuery,
} = publishApi;
