import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { questionBuilderSchema, type QuestionBuilderFormValues } from '../schemas/questionBuilderSchema';

export function useQuestionBuilder() {
  const form = useForm<QuestionBuilderFormValues>({
    resolver: zodResolver(questionBuilderSchema),
    defaultValues: {
      questionText: '',
      options: [
        { id: 'opt_1', text: '' },
        { id: 'opt_2', text: '' },
        { id: 'opt_3', text: '' },
        { id: 'opt_4', text: '' },
      ],
      correctOptionId: '',
      solutionText: '',
      difficulty: '',
      topic: '',
      subTopic: '',
    },
  });

  const onSubmit = async (data: QuestionBuilderFormValues) => {
    try {
      // Mock API call
      console.log('Saving question...', data);
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success('Question saved successfully');
    } catch {
      toast.error('Failed to save question');
    }
  };

  const handleNext = () => {
    form.handleSubmit(onSubmit)();
  };

  const handleDeleteAllEdits = () => {
    form.reset();
  };

  return {
    form,
    handleNext,
    handleDeleteAllEdits,
  };
}
