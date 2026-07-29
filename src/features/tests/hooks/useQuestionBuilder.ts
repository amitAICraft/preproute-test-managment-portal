import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  questionBuilderSchema,
  type QuestionBuilderFormValues,
} from '../schemas/questionBuilderSchema';
import { useBulkCreateQuestionsMutation } from '@/services/questionApi';

export function useQuestionBuilder(testId?: string, subjectId?: string, onSaveSuccess?: () => void) {
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
          // The form stores the option's id which is already 'option1'...'option4'.
          const correctOption = data.correctOptionId;

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
          if (data.topic) questionPayload.topic = data.topic;
          if (data.subTopic) questionPayload.sub_topic = data.subTopic;

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
