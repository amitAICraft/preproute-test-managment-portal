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
    try {
      await publishTest({ testId: testId || '' }).unwrap();
      toast.success('Test published successfully!');
      navigate(ROUTES.DASHBOARD);
    } catch {
      toast.error('Failed to publish test');
    }
  };

  const onCancel = () => {
    navigate(ROUTES.DASHBOARD);
  };

  return {
    form,
    onSubmit,
    onCancel,
    isLoading
  };
}
