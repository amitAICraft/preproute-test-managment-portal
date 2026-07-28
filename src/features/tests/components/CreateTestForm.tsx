import { Controller, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { ROUTES } from '@/constants/routes';
import { useCreateTest } from '../hooks/useCreateTest';
import { 
  TEST_TYPES, 
  DIFFICULTY_LEVELS,
  CREATE_TEST_ACTIONS,
  TEST_FORM_CONSTANTS
} from '../constants/test.constants';
import { 
  useGetSubjectsQuery, 
  useGetTopicsBySubjectQuery, 
  useGetSubTopicsQuery 
} from '@/services/taxonomyApi';
import { TextField } from '@/components/forms/TextField';
import { SelectField } from '@/components/forms/SelectField';
import { RadioGroupField } from '@/components/forms/RadioGroupField';
import { Tabs } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LoadingButton } from '@/components/common/LoadingButton';

export function CreateTestForm() {
  const navigate = useNavigate();
  
  const { form, onSubmit, isLoading } = useCreateTest({
    onSuccess: (createdTest) => {
      navigate(`/tests/create/questions?testId=${createdTest.id}`); 
    },
  });

  const { register, control, handleSubmit, formState: { errors } } = form;

  const selectedSubject = useWatch({ control, name: 'subject' });
  const selectedTopic = useWatch({ control, name: 'topic' });
  const totalQuestions = useWatch({ control, name: 'totalQuestions' });
  const correctAnswerMarks = useWatch({ control, name: 'markingScheme.correctAnswer' });
  const totalMarks = (totalQuestions || 0) * (correctAnswerMarks || 0);

  const { data: subjects = [] } = useGetSubjectsQuery();
  const { data: topics = [] } = useGetTopicsBySubjectQuery(selectedSubject, {
    skip: !selectedSubject,
  });
  const { data: subTopics = [] } = useGetSubTopicsQuery(selectedTopic ? [selectedTopic] : [], {
    skip: !selectedTopic,
  });

  const subjectOptions = subjects.map((s) => ({ label: s.name, value: s.id }));
  const topicOptions = topics.map((t) => ({ label: t.name, value: t.id }));
  const subTopicOptions = subTopics.map((st) => ({ label: st.name, value: st.id }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
      
      {/* Test Type Tabs */}
      <div>
        <Controller
          name="testType"
          control={control}
          render={({ field }) => (
            <Tabs
              options={TEST_TYPES}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        {errors.testType && (
          <p className="mt-2 text-sm text-destructive">{errors.testType.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
        {/* Subject & Name */}
        <SelectField
          label={TEST_FORM_CONSTANTS.LABELS.SUBJECT}
          options={subjectOptions}
          placeholder={TEST_FORM_CONSTANTS.PLACEHOLDERS.DROPDOWN}
          error={errors.subject?.message}
          {...register('subject')}
        />
        <TextField
          label={TEST_FORM_CONSTANTS.LABELS.NAME_OF_TEST}
          placeholder={TEST_FORM_CONSTANTS.PLACEHOLDERS.TEST_NAME}
          error={errors.title?.message}
          {...register('title')}
        />

        {/* Topic & Sub Topic */}
        <SelectField
          label={TEST_FORM_CONSTANTS.LABELS.TOPIC}
          options={topicOptions}
          placeholder={TEST_FORM_CONSTANTS.PLACEHOLDERS.DROPDOWN}
          error={errors.topic?.message}
          disabled={!selectedSubject}
          {...register('topic')}
        />
        <SelectField
          label={TEST_FORM_CONSTANTS.LABELS.SUB_TOPIC}
          options={subTopicOptions}
          placeholder={TEST_FORM_CONSTANTS.PLACEHOLDERS.DROPDOWN}
          error={errors.subTopic?.message}
          disabled={!selectedTopic}
          {...register('subTopic')}
        />

        {/* Duration & Difficulty */}
        <TextField
          label={TEST_FORM_CONSTANTS.LABELS.DURATION}
          placeholder={TEST_FORM_CONSTANTS.PLACEHOLDERS.DURATION}
          type="number"
          error={errors.duration?.message}
          {...register('duration', { valueAsNumber: true })}
        />
        <Controller
          name="difficultyLevel"
          control={control}
          render={({ field }) => (
            <RadioGroupField
              label={TEST_FORM_CONSTANTS.LABELS.DIFFICULTY}
              name={field.name}
              options={DIFFICULTY_LEVELS}
              value={field.value}
              onChange={field.onChange}
              error={errors.difficultyLevel?.message}
            />
          )}
        />
      </div>

      {/* Marking Scheme & Questions Row */}
      <div className="space-y-4">
        <h3 className="text-base font-medium text-foreground">{TEST_FORM_CONSTANTS.LABELS.MARKING_SCHEME}</h3>
        <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-12 items-end">
          <div className="md:col-span-2">
            <TextField
              label={TEST_FORM_CONSTANTS.LABELS.WRONG_ANSWER}
              type="number"
              placeholder={TEST_FORM_CONSTANTS.PLACEHOLDERS.WRONG_ANSWER}
              error={errors.markingScheme?.wrongAnswer?.message}
              {...register('markingScheme.wrongAnswer', { valueAsNumber: true })}
            />
          </div>
          <div className="md:col-span-2">
            <TextField
              label={TEST_FORM_CONSTANTS.LABELS.UNATTEMPTED}
              type="number"
              placeholder={TEST_FORM_CONSTANTS.PLACEHOLDERS.UNATTEMPTED}
              error={errors.markingScheme?.unattempted?.message}
              {...register('markingScheme.unattempted', { valueAsNumber: true })}
            />
          </div>
          <div className="md:col-span-2">
            <TextField
              label={TEST_FORM_CONSTANTS.LABELS.CORRECT_ANSWER}
              type="number"
              placeholder={TEST_FORM_CONSTANTS.PLACEHOLDERS.CORRECT_ANSWER}
              error={errors.markingScheme?.correctAnswer?.message}
              {...register('markingScheme.correctAnswer', { valueAsNumber: true })}
            />
          </div>
          <div className="md:col-span-3">
            <TextField
              label={TEST_FORM_CONSTANTS.LABELS.NO_OF_QUESTIONS}
              type="number"
              placeholder={TEST_FORM_CONSTANTS.PLACEHOLDERS.QUESTIONS}
              error={errors.totalQuestions?.message}
              {...register('totalQuestions', { valueAsNumber: true })}
            />
          </div>
          <div className="md:col-span-3">
            <TextField
              label={TEST_FORM_CONSTANTS.LABELS.TOTAL_MARKS}
              name="totalMarks"
              type="text"
              placeholder={TEST_FORM_CONSTANTS.PLACEHOLDERS.MARKS}
              disabled
              value={totalMarks > 0 ? `${totalMarks} Marks` : ''}
              className="bg-slate-50 cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-6">
        <Button
          type="button"
          variant="ghost"
          onClick={() => navigate(ROUTES.DASHBOARD)}
          className="px-8 bg-[#f4f6ff] text-blue-600 hover:bg-indigo-50 hover:text-blue-700"
        >
          {CREATE_TEST_ACTIONS.CANCEL}
        </Button>
        <LoadingButton
          type="submit"
          isLoading={isLoading}
          loadingText={CREATE_TEST_ACTIONS.SAVING}
          className="px-12 bg-blue-500 hover:bg-blue-600"
        >
          {CREATE_TEST_ACTIONS.NEXT}
        </LoadingButton>
      </div>

    </form>
  );
}
