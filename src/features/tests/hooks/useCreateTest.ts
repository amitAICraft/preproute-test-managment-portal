import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/utils';
import { createTestSchema, type CreateTestFormValues } from '../schemas';
import { useCreateTestMutation } from '../api/testApi';
import { TEST_FORM_DEFAULTS, TEST_MESSAGES } from '../constants';
import type { Test } from '../types';

// Hook - business logic for creating a test.

export function useCreateTest(options?: { onSuccess?: (test: Test) => void }) {
  const [createTest, { isLoading }] = useCreateTestMutation();

  const form = useForm<CreateTestFormValues>({
    resolver: zodResolver(createTestSchema),
    defaultValues: TEST_FORM_DEFAULTS,
  });

  const onSubmit = useCallback(
    async (data: CreateTestFormValues) => {
      try {
        const payload = {
          ...data,
          totalMarks: (data.totalQuestions || 0) * (data.markingScheme.correctAnswer || 0),
        };
        const created = await createTest(payload as any).unwrap();
        toast.success(TEST_MESSAGES.CREATE.SUCCESS);
        form.reset();
        options?.onSuccess?.(created);
      } catch (err: any) {
        const errorMsg = getApiErrorMessage(err, TEST_MESSAGES.CREATE.ERROR);
        toast.error(errorMsg);
      }
    },
    [createTest, form, options],
  );

  return {
    form,
    onSubmit,
    isLoading,
  };
}
