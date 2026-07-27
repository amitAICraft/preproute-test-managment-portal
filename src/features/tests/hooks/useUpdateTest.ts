import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
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
      topic: '',
      subTopic: '',
      duration: 0,
      difficultyLevel: 'easy',
      markingScheme: { wrongAnswer: -1, unattempted: 0, correctAnswer: 5 },
      totalQuestions: 0,
    },
  });

  /**
   * Sync form values when the existing test data arrives
   * (e.g. from a network fetch or cache hit).
   */
  useEffect(() => {
    if (existingTest) {
      form.reset({
        id: existingTest.id,
        testType: existingTest.testType,
        subject: existingTest.subject,
        title: existingTest.title,
        topic: existingTest.topic,
        subTopic: existingTest.subTopic ?? '',
        duration: existingTest.duration,
        difficultyLevel: existingTest.difficultyLevel,
        markingScheme: { ...existingTest.markingScheme },
        totalQuestions: existingTest.totalQuestions,
      });
    }
  }, [existingTest, form]);

  const onSubmit = useCallback(
    async (data: UpdateTestFormValues) => {
      try {
        const updated = await updateTest(data).unwrap();
        toast.success(TEST_MESSAGES.UPDATE.SUCCESS);
        options?.onSuccess?.(updated);
      } catch {
        toast.error(TEST_MESSAGES.UPDATE.ERROR);
      }
    },
    [updateTest, options],
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
