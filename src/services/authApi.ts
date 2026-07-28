import { baseApi } from './baseApi';
import type { ApiResponse, AuthUser } from '@/types';

// ── Types ────────────────────────────────────────────────
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
// ── Injected endpoints ───────────────────────────────────
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

    register: builder.mutation<LoginData, RegisterRequest>({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
    }),

    getMe: builder.query<AuthUser, void>({
      query: () => '/auth/me',
      transformResponse: (response: ApiResponse<AuthUser>) => response.data,
      providesTags: ['Auth'],
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useGetMeQuery, useLogoutMutation } = authApi;
