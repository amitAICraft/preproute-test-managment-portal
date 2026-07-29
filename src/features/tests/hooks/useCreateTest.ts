import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { createTestSchema, type CreateTestFormValues } from '../schemas';
import { useCreateTestMutation } from '../api/testApi';
import { TEST_FORM_DEFAULTS, TEST_MESSAGES } from '../constants';
import type { Test } from '../types';

/**
 * Hook — business logic for creating a test.
 *
 * Integrates react-hook-form + Zod validation + RTK mutation
 * into a single composable unit. Components only need to render
 * form fields and call `onSubmit`.
 *
 * @param options.onSuccess - Callback invoked with the created Test on success.
 */
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
        let errorMsg = TEST_MESSAGES.CREATE.ERROR;
        if (err && typeof err === 'object') {
          const responseData = (err as any).data;
          if (responseData && typeof responseData === 'object' && typeof responseData.message === 'string') {
            errorMsg = responseData.message;
          } else if (typeof (err as any).message === 'string') {
            errorMsg = (err as any).message;
          }
        }
        toast.error(errorMsg);
      }
    },
    [createTest, form, options],
  );

  return {
    /** react-hook-form instance — spread into form fields. */
    form,
    /** Submit handler — pass to `form.handleSubmit(onSubmit)`. */
    onSubmit,
    /** True while the mutation is in flight. */
    isLoading,
  };
}
