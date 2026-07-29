import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { publishTestSchema, type PublishTestFormValues } from '../schemas/publishTestSchema';
import { ROUTES } from '@/constants/routes';
import { usePublishTestMutation } from '@/services/publishApi';

export function usePublishTest(testId?: string) {
  const navigate = useNavigate();
  const [publishTest, { isLoading }] = usePublishTestMutation();

  const form = useForm<PublishTestFormValues>({
    resolver: zodResolver(publishTestSchema),
    defaultValues: {
      publishType: 'publish_now',
      duration: 'always',
      scheduleDate: '',
      scheduleTime: '',
      endDate: '',
      endTime: '',
    },
  });

  const onSubmit = async (_data: PublishTestFormValues) => {
    // Prevent duplicate submissions while loading
    if (isLoading) return;

    if (!testId) {
      toast.error('No test ID found. Cannot publish.');
      return;
    }

    try {
      // API contract: PUT /tests/:id with { status: 'live' }
      // "Live Until", "Custom Duration", and schedule datetime fields are frontend-only UI.
      // The documented API does not accept these as payload parameters.
      await publishTest({ testId }).unwrap();
      toast.success('Test published successfully!');
      navigate(ROUTES.DASHBOARD);
    } catch {
      toast.error('Failed to publish test. Please try again.');
    }
  };

  // Cancel must return to the Question Builder for the SAME test, preserving testId.
  // Never redirect to Dashboard (which loses context).
  const onCancel = () => {
    if (testId) {
      navigate(`${ROUTES.TESTS.QUESTIONS}?testId=${testId}`);
    } else {
      navigate(ROUTES.TESTS.QUESTIONS);
    }
  };

  return {
    form,
    onSubmit,
    onCancel,
    isLoading,
  };
}
