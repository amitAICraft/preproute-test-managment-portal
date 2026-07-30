import { baseApi } from './baseApi';
import type { ApiResponse } from '@/types';

// Types

export interface Subject {
  id: string;
  name: string;
}

export interface Topic {
  id: string;
  name: string;
  subject_id: string;
}

export interface SubTopic {
  id: string;
  name: string;
  topic_id: string;
}

export interface MultiTopicsRequest {
  topicIds: string[];
}

// ******************** All subjects topics endpoints ***********************
export const taxonomyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSubjects: builder.query<Subject[], void>({
      query: () => '/subjects',
      transformResponse: (response: ApiResponse<Subject[]>) => response.data,
      providesTags: ['Test'], // Simplification- re-fetch when tests change or manually
    }),

    getTopicsBySubject: builder.query<Topic[], string>({
      query: (subjectId) => `/topics/subject/${subjectId}`,
      transformResponse: (response: ApiResponse<Topic[]>) => response.data,
    }),

    getSubTopics: builder.query<SubTopic[], string[]>({
      query: (topicIds) => ({
        url: '/sub-topics/multi-topics',
        method: 'POST',
        body: { topicIds },
      }),
      transformResponse: (response: ApiResponse<SubTopic[]>) => response.data,
    }),
  }),
});

export const { useGetSubjectsQuery, useGetTopicsBySubjectQuery, useGetSubTopicsQuery } =
  taxonomyApi;
