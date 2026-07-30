import { baseApi } from './baseApi';
import type { ApiResponse, AuthUser } from '@/types';

// Types
export interface LoginRequest {
  userId: string;
  password: string;
}

export interface LoginData {
  token: string;
  user: AuthUser;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}
// Main endpoints
export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginData, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response: ApiResponse<LoginData>) => response.data,
      invalidatesTags: ['Auth'],
    }),
  }),
});

export const { useLoginMutation } = authApi;
