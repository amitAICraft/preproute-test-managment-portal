import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { questionBuilderSchema, type QuestionBuilderFormValues } from '../schemas/questionBuilderSchema';
import { useBulkCreateQuestionsMutation } from '@/services/questionApi';

export function useQuestionBuilder() {
  const [bulkCreate, { isLoading }] = useBulkCreateQuestionsMutation();
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
      await bulkCreate({
        questions: [{
          type: 'mcq',
          question: data.questionText,
          option1: data.options[0]?.text || '',
          option2: data.options[1]?.text || '',
          option3: data.options[2]?.text || '',
          option4: data.options[3]?.text || '',
          correct_option: data.correctOptionId || 'option1',
          explanation: data.solutionText || '',
          difficulty: data.difficulty || 'medium',
          test_id: 'test-uuid-placeholder' // Needs to be replaced when routing is implemented
        }]
      }).unwrap();
      
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
    isLoading
  };
}
