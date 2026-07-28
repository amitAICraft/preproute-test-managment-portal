import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import type { RootState } from '@/app/store';
import { logout } from '@/features/auth/authSlice';

/**
 * Inner fetchBaseQuery — reads token from Redux state.
 */
const rawBaseQuery = fetchBaseQuery({
  baseUrl: "https://admin-moderator-backend-staging.up.railway.app/api",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

/**
 * Wrapper that intercepts 401 / 403 / 500 globally.
 */
const baseQueryWithGlobalHandlers: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error) {
    const status = result.error.status;

    if (status === 401) {
      api.dispatch(logout());
      // Optionally redirect handled by ProtectedRoute guard
    }

    if (status === 403) {
      console.error('[API] Forbidden — insufficient permissions');
    }

    if (status === 500) {
      console.error('[API] Internal server error');
    }
  }

  return result;
};

/**
 * Base API — single createApi instance for the entire app.
 * Feature APIs inject endpoints via `baseApi.injectEndpoints()`.
 */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithGlobalHandlers,
  tagTypes: ['Auth', 'Test', 'Question', 'Publish'],
  endpoints: () => ({}),
});
