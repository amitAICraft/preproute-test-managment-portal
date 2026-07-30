import { skipToken } from '@reduxjs/toolkit/query/react';
import { useGetTestByIdQuery } from '../api/testApi';

// Hook - fetches a single test by ID.

export function useTest(testId: string | undefined) {
  const { data: test, isLoading, isError, error } = useGetTestByIdQuery(testId ?? skipToken);

  return {
    test,
    isLoading,
    isError,
    error,
  };
}
