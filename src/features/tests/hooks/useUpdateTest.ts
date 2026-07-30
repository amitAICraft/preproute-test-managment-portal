import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/utils';
import { updateTestSchema, type UpdateTestFormValues } from '../schemas';
import { useUpdateTestMutation } from '../api/testApi';
import { TEST_MESSAGES } from '../constants';
import type { Test } from '../types';

/**
 * Hook — business logic for editing an existing test.
 *
 * Pre-populates the form from `existingTest`, integrates
 * react-hook-form + Zod + RTK mutation, and handles toasts.
 *
 * @param existingTest  - The test to edit (from `useTest` or list cache).
 * @param options.onSuccess - Callback invoked with the updated Test on success.
 */
export function useUpdateTest(
  existingTest: Test | undefined,
  options?: { onSuccess?: (test: Test) => void },
) {
  const [updateTest, { isLoading }] = useUpdateTestMutation();

  const form = useForm<UpdateTestFormValues>({
    resolver: zodResolver(updateTestSchema),
    defaultValues: {
      id: '',
      testType: 'chapterwise',
      subject: '',
      title: '',
      topics: [],
      subTopics: [],
      duration: 0,
      difficultyLevel: 'easy',
      markingScheme: { wrongAnswer: -1, unattempted: 0, correctAnswer: 5 },
      totalQuestions: 0,
    },
  });

  // Prefill logic is handled in EditTestDialog.tsx to allow cascading taxonomy API resolution

  const onSubmit = useCallback(
    async (data: UpdateTestFormValues) => {
      try {
        const payload = {
          ...data,
          totalMarks: existingTest?.totalMarks || 0,
        };
        const updated = await updateTest(payload).unwrap();
        toast.success(TEST_MESSAGES.UPDATE.SUCCESS);
        options?.onSuccess?.(updated);
      } catch (err: any) {
        const errorMsg = getApiErrorMessage(err, TEST_MESSAGES.UPDATE.ERROR);
        toast.error(errorMsg);
      }
    },
    [updateTest, existingTest, options],
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
