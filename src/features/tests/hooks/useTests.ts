import { useGetTestsQuery } from '../api/testApi';
import type { TestListParams } from '../types';

/**
 * Hook — fetches paginated test list.
 *
 * Wraps `useGetTestsQuery` and flattens the paginated response
 * so consumers don't need to dig into `data.data`.
 *
 * @param params - Optional filter/pagination params.
 */
export function useTests(params?: TestListParams) {
  const { data, isLoading, isFetching, isError, error, refetch } = useGetTestsQuery(params);

  return {
    /** Array of Test entities for the current page. */
    tests: data?.data ?? [],
    /** Total count across all pages. */
    total: data?.total ?? 0,
    /** Total number of pages. */
    totalPages: data?.totalPages ?? 0,
    /** Current page number. */
    page: data?.page ?? 1,
    /** True on initial load (no cached data yet). */
    isLoading,
    /** True on any fetch (initial + refetch). */
    isFetching,
    /** True if the last request failed. */
    isError,
    /** Error object if the last request failed. */
    error,
    /** Manually re-fetch the current page. */
    refetch,
  };
}
