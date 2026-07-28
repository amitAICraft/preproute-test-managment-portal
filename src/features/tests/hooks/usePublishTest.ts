import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { publishTestSchema, type PublishTestFormValues } from '../schemas/publishTestSchema';
import { ROUTES } from '@/constants/routes';

export function usePublishTest() {
  const navigate = useNavigate();
  
  const form = useForm<PublishTestFormValues>({
    resolver: zodResolver(publishTestSchema),
    defaultValues: {
      publishType: 'publish_now',
      duration: 'always',
      endDate: '',
      endTime: '',
    },
  });

  const onSubmit = async (data: PublishTestFormValues) => {
    try {
      // Mock API call
      console.log('Publishing test...', data);
      await new Promise((resolve) => setTimeout(resolve, 800));
      toast.success('Test published successfully!');
      navigate(ROUTES.DASHBOARD);
    } catch {
      toast.error('Failed to publish test');
    }
  };

  const onCancel = () => {
    navigate(ROUTES.DASHBOARD); // or wherever makes sense
  };

  return {
    form,
    onSubmit,
    onCancel,
  };
}
