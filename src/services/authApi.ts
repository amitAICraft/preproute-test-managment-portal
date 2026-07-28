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

// ── Mock credentials (remove when real backend is available) ──
const MOCK_USER_ID = 'admin';
const MOCK_PASSWORD = 'admin';
const MOCK_DELAY_MS = 500;

// ── Injected endpoints ───────────────────────────────────
export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Login mutation.
     *
     * Uses a mock `queryFn` because no backend server is available.
     * When a real API exists, replace `queryFn` with the commented-out
     * `query` + `transformResponse` below.
     *
     * Real backend:
     * ```
     * query: (credentials) => ({
     *   url: '/auth/login',
     *   method: 'POST',
     *   body: credentials,
     * }),
     * transformResponse: (response: ApiResponse<LoginData>) => response.data,
     * ```
     */
    login: builder.mutation<LoginData, LoginRequest>({
      queryFn: async (credentials) => {
        // Simulate network latency
        await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));

        if (
          credentials.userId === MOCK_USER_ID &&
          credentials.password === MOCK_PASSWORD
        ) {
          return {
            data: {
              token: 'mock-jwt-token-' + Date.now(),
              user: {
                id: '1',
                name: 'Alex Wando',
                email: 'alex@preproute.com',
                role: 'Admin',
              },
            },
          };
        }

        return {
          error: {
            status: 401,
            data: { message: 'Invalid User ID or Password.' },
          },
        };
      },
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
