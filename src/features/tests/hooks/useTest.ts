import { skipToken } from '@reduxjs/toolkit/query/react';
import { useGetTestByIdQuery } from '../api/testApi';

/**
 * Hook — fetches a single test by ID.
 *
 * Wraps `useGetTestByIdQuery` and handles the `skip` case
 * when the ID is not yet available (e.g. during route transitions).
 *
 * @param testId - The test ID to fetch, or `undefined` to skip.
 */
export function useTest(testId: string | undefined) {
  const { data: test, isLoading, isError, error } = useGetTestByIdQuery(testId ?? skipToken);

  return {
    /** The fetched Test entity, or `undefined` if not loaded. */
    test,
    /** True while the request is in flight. */
    isLoading,
    /** True if the last request failed. */
    isError,
    /** Error object if the last request failed. */
    error,
  };
}
