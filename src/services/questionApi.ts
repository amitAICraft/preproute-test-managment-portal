import { baseApi } from './baseApi';

// ── Types ────────────────────────────────────────────────
export interface Question {
  id: string;
  testId: string;
  text: string;
  type: 'mcq' | 'true-false' | 'short-answer';
  options: QuestionOption[];
  correctAnswer: string;
  marks: number;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface CreateQuestionRequest {
  testId: string;
  text: string;
  type: Question['type'];
  options: Omit<QuestionOption, 'id'>[];
  correctAnswer: string;
  marks: number;
}

export interface UpdateQuestionRequest {
  id: string;
  text?: string;
  type?: Question['type'];
  options?: Omit<QuestionOption, 'id'>[];
  correctAnswer?: string;
  marks?: number;
  order?: number;
}

export interface ReorderQuestionsRequest {
  testId: string;
  questionIds: string[];
}

// ── Injected endpoints ───────────────────────────────────
export const questionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getQuestionsByTest: builder.query<Question[], string>({
      query: (testId) => `/tests/${testId}/questions`,
      providesTags: (result, _error, testId) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Question' as const, id })),
              { type: 'Question', id: `TEST-${testId}` },
            ]
          : [{ type: 'Question', id: `TEST-${testId}` }],
    }),

    getQuestionById: builder.query<Question, string>({
      query: (id) => `/questions/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Question', id }],
    }),

    createQuestion: builder.mutation<Question, CreateQuestionRequest>({
      query: ({ testId, ...body }) => ({
        url: `/tests/${testId}/questions`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, { testId }) => [
        { type: 'Question', id: `TEST-${testId}` },
        { type: 'Test', id: testId },
      ],
    }),

    updateQuestion: builder.mutation<Question, UpdateQuestionRequest>({
      query: ({ id, ...body }) => ({
        url: `/questions/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Question', id }],
    }),

    deleteQuestion: builder.mutation<void, { id: string; testId: string }>({
      query: ({ id }) => ({
        url: `/questions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { id, testId }) => [
        { type: 'Question', id },
        { type: 'Question', id: `TEST-${testId}` },
        { type: 'Test', id: testId },
      ],
    }),

    reorderQuestions: builder.mutation<void, ReorderQuestionsRequest>({
      query: ({ testId, questionIds }) => ({
        url: `/tests/${testId}/questions/reorder`,
        method: 'PUT',
        body: { questionIds },
      }),
      invalidatesTags: (_result, _error, { testId }) => [
        { type: 'Question', id: `TEST-${testId}` },
      ],
    }),
  }),
});

export const {
  useGetQuestionsByTestQuery,
  useGetQuestionByIdQuery,
  useCreateQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
  useReorderQuestionsMutation,
} = questionApi;
