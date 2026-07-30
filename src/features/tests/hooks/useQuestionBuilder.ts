import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  questionBuilderSchema,
  type QuestionBuilderFormValues,
} from '../schemas/questionBuilderSchema';
import { useBulkCreateQuestionsMutation } from '@/services/questionApi';

export function useQuestionBuilder(
  testId?: string,
  subjectId?: string,
  getValidTopicIds?: () => string[],
  getValidSubTopicIds?: () => string[],
  onSaveSuccess?: () => void,
) {
  const [bulkCreate, { isLoading }] = useBulkCreateQuestionsMutation();
  const form = useForm<QuestionBuilderFormValues>({
    resolver: zodResolver(questionBuilderSchema),
    defaultValues: {
      questionText: '',
      options: [
        { id: 'option1', text: '' },
        { id: 'option2', text: '' },
        { id: 'option3', text: '' },
        { id: 'option4', text: '' },
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
          // correct_option must be 'option1'|'option2'|'option3'|'option4' per API contract.
          const correctOption = data.correctOptionId;

          const validTopicIds = getValidTopicIds ? getValidTopicIds() : [];
          const validSubTopicIds = getValidSubTopicIds ? getValidSubTopicIds() : [];

          // Check if topics are selected but the valid lists are empty (loading) or the selected ID is invalid
          if (data.topic && validTopicIds.length === 0) {
            toast.error('Please wait for topics to load.');
            return;
          }
          if (data.topic && !validTopicIds.includes(data.topic)) {
            toast.error('Selected topic is invalid or no longer exists.');
            return;
          }
          
          if (data.subTopic && validSubTopicIds.length === 0) {
            toast.error('Please wait for sub-topics to load.');
            return;
          }
          if (data.subTopic && !validSubTopicIds.includes(data.subTopic)) {
            toast.error('Selected sub-topic is invalid or no longer exists.');
            return;
          }

          const questionPayload: any = {
            type: 'mcq',
            question: data.questionText,
            option1: data.options[0]?.text || '',
            option2: data.options[1]?.text || '',
            option3: data.options[2]?.text || '',
            option4: data.options[3]?.text || '',
            correct_option: correctOption,
            explanation: data.solutionText || '',
            difficulty: data.difficulty || 'medium',
            test_id: testId || '',
            subject: subjectId || '',
          };

          await bulkCreate({
            questions: [questionPayload],
          }).unwrap();
      toast.success('Question saved successfully!');
      form.reset({
        questionText: '',
        options: [
          { id: 'option1', text: '' },
          { id: 'option2', text: '' },
          { id: 'option3', text: '' },
          { id: 'option4', text: '' },
        ],
        correctOptionId: '',
        solutionText: '',
        difficulty: '',
        topic: '',
        subTopic: '',
      });
      onSaveSuccess?.();
    } catch {
      toast.error('Failed to save question');
    }
  };

  const handleNext = () => {
    form.handleSubmit(onSubmit, (_errors) => {
      toast.error('Please fill all required fields before continuing.');
      // Scroll to and focus the first invalid field
      setTimeout(() => {
        const firstInvalid =
          document.querySelector<HTMLElement>('[aria-invalid="true"]') ||
          document.querySelector<HTMLElement>('.rich-text-editor-container.border-red-500 .ProseMirror') ||
          document.querySelector<HTMLElement>('input[data-invalid]');
        if (firstInvalid) {
          firstInvalid.focus();
          firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 50);
    })();
  };

  const handleDeleteAllEdits = () => {
    form.reset({
      questionText: '',
      options: [
        { id: 'option1', text: '' },
        { id: 'option2', text: '' },
        { id: 'option3', text: '' },
        { id: 'option4', text: '' },
      ],
      correctOptionId: '',
      solutionText: '',
      difficulty: '',
      topic: '',
      subTopic: '',
    });
  };

  return {
    form,
    handleNext,
    handleDeleteAllEdits,
    isLoading,
  };
}
