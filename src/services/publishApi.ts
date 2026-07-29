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
        url: `/tests/${testId}`,
        method: 'PUT',
        body: { status: 'live' },
      }),
      invalidatesTags: (_result, _error, { testId }) => [
        { type: 'Publish', id: testId },
        { type: 'Test', id: testId },
        { type: 'Test', id: 'LIST' },
      ],
    }),
  }),
});

export const { usePublishTestMutation } = publishApi;
