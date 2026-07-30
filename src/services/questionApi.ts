import { baseApi } from './baseApi';
import type { ApiResponse } from '@/types';

//Types

export interface BackendQuestion {
  id: string;
  type: string;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correct_option: string;
  explanation: string;
  difficulty: string;
  test_id: string;
}

export interface Question {
  id: string;
  testId: string;
  text: string;
  type: 'mcq' | 'true-false' | 'short-answer';
  options: QuestionOption[];
  correctAnswer: string;
  explanation?: string;
  difficulty?: string;
}

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface BulkCreateQuestionsRequest {
  questions: Omit<BackendQuestion, 'id'>[];
}

export interface FetchBulkQuestionsRequest {
  question_ids: string[];
}

// all Mapping helpers are written here

const mapBackendToFrontendQuestion = (backendQ: BackendQuestion): Question => ({
  id: backendQ.id,
  testId: backendQ.test_id,
  text: backendQ.question,
  type: (backendQ.type as any) || 'mcq',
  options: [
    { id: 'option1', text: backendQ.option1, isCorrect: backendQ.correct_option === 'option1' },
    { id: 'option2', text: backendQ.option2, isCorrect: backendQ.correct_option === 'option2' },
    { id: 'option3', text: backendQ.option3, isCorrect: backendQ.correct_option === 'option3' },
    { id: 'option4', text: backendQ.option4, isCorrect: backendQ.correct_option === 'option4' },
  ],
  correctAnswer: backendQ.correct_option,
  explanation: backendQ.explanation,
  difficulty: backendQ.difficulty,
});

// **************** questions all endpoints **************************
export const questionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchBulkQuestions: builder.query<Question[], FetchBulkQuestionsRequest>({
      query: (body) => ({
        url: '/questions/fetchBulk',
        method: 'POST',
        body,
      }),
      transformResponse: (response: ApiResponse<BackendQuestion[]>) =>
        response.data.map(mapBackendToFrontendQuestion),
      providesTags: (result) =>
        result ? result.map(({ id }) => ({ type: 'Question' as const, id })) : [],
    }),

    bulkCreateQuestions: builder.mutation<Question[], BulkCreateQuestionsRequest>({
      query: (body) => ({
        url: '/questions/bulk',
        method: 'POST',
        body,
      }),
      transformResponse: (response: ApiResponse<BackendQuestion[]>) =>
        response.data.map(mapBackendToFrontendQuestion),
      invalidatesTags: (_result, _error, arg) => [
        { type: 'Test' as const, id: arg.questions[0]?.test_id },
      ],
    }),
  }),
});

export const { useFetchBulkQuestionsQuery, useBulkCreateQuestionsMutation } = questionApi;
