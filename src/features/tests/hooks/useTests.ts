import { useGetTestsQuery } from '../api/testApi';
import type { TestListParams } from '../types';
 
// Hook - fetches paginated test list.

export function useTests(params?: TestListParams) {
  const { data, isLoading, isFetching, isError, error, refetch } = useGetTestsQuery(params);

  return {
    tests: data?.data ?? [],
    total: data?.total ?? 0,
    totalPages: data?.totalPages ?? 0,
    page: data?.page ?? 1,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  };
}
