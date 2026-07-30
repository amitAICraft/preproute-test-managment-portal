import { useEffect, useRef } from 'react';
import { Controller, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { ROUTES } from '@/constants/routes';
import { useCreateTest } from '../hooks/useCreateTest';
import {
  TEST_TYPES,
  DIFFICULTY_LEVELS,
  CREATE_TEST_ACTIONS,
  TEST_FORM_CONSTANTS,
} from '../constants/test.constants';
import {
  useGetSubjectsQuery,
  useGetTopicsBySubjectQuery,
  useGetSubTopicsQuery,
} from '@/services/taxonomyApi';
import { SelectField } from '@/components/forms/SelectField';
import { MultiSelectField } from '@/components/forms/MultiSelectField';
import { TextField } from '@/components/forms/TextField';
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

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  const selectedSubject = useWatch({ control, name: 'subject' });
  const selectedTopics = useWatch({ control, name: 'topics' });
  const totalQuestions = useWatch({ control, name: 'totalQuestions' });
  const correctAnswerMarks = useWatch({ control, name: 'markingScheme.correctAnswer' });
  const totalMarks = (totalQuestions || 0) * (correctAnswerMarks || 0);

  const { data: subjects = [] } = useGetSubjectsQuery();
  const { data: topics = [] } = useGetTopicsBySubjectQuery(selectedSubject, {
    skip: !selectedSubject,
  });
  const { data: subTopics = [] } = useGetSubTopicsQuery(
    selectedTopics?.length ? selectedTopics : [],
    {
      skip: !selectedTopics?.length,
    },
  );

  // clear subtopics whenever topic selection changes (not just when empty)
  const prevTopicsRef = useRef<string[]>([]);
  useEffect(() => {
    const prev = prevTopicsRef.current;
    const curr = selectedTopics ?? [];
    const changed = curr.length !== prev.length || curr.some((t, i) => t !== prev[i]);
    if (changed) {
      form.setValue('subTopics', []);
    }
    prevTopicsRef.current = curr;
  }, [selectedTopics, form]);

  const subjectOptions = subjects.map((s) => ({ label: s.name, value: s.id }));
  const topicOptions = topics.map((t) => ({ label: t.name, value: t.id }));
  const subTopicOptions = subTopics.map((st) => ({ label: st.name, value: st.id }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
      {/* test type tabs */}
      <div>
        <Controller
          name="testType"
          control={control}
          render={({ field }) => (
            <Tabs options={TEST_TYPES} value={field.value} onChange={field.onChange} />
          )}
        />
        {errors.testType && (
          <p className="text-destructive mt-2 text-sm">{errors.testType.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
        {/* subject & name */}
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

        <Controller
          name="topics"
          control={control}
          render={({ field }) => (
            <MultiSelectField
              label={TEST_FORM_CONSTANTS.LABELS.TOPIC}
              name={field.name}
              options={topicOptions}
              placeholder={TEST_FORM_CONSTANTS.PLACEHOLDERS.DROPDOWN}
              error={errors.topics?.message}
              disabled={!selectedSubject}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <Controller
          name="subTopics"
          control={control}
          render={({ field }) => (
            <MultiSelectField
              label={TEST_FORM_CONSTANTS.LABELS.SUB_TOPIC}
              name={field.name}
              options={subTopicOptions}
              placeholder={TEST_FORM_CONSTANTS.PLACEHOLDERS.DROPDOWN}
              error={errors.subTopics?.message}
              disabled={!selectedTopics?.length}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        {/* duration and difficulty leve displayed here */}
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

      {/* marking Scheme and questions Row */}
      <div className="space-y-6">
        <h3 className="text-base font-medium text-[#374151]">
          {TEST_FORM_CONSTANTS.LABELS.MARKING_SCHEME}
        </h3>
        <div className="grid grid-cols-1 items-start gap-x-6 gap-y-4 md:grid-cols-12">
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
              className="cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400 opacity-70"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-6 pt-10">
        <Button
          type="button"
          variant="ghost"
          onClick={() => navigate(ROUTES.DASHBOARD)}
          className="h-12 rounded-lg bg-[#F4F6FF] px-12 font-medium text-[#7489FF] hover:bg-[#EBEEFF] hover:text-[#5B73E8]"
        >
          {CREATE_TEST_ACTIONS.CANCEL}
        </Button>
        <LoadingButton
          type="submit"
          isLoading={isLoading}
          loadingText={CREATE_TEST_ACTIONS.SAVING}
          className="h-12 rounded-lg bg-[#7489FF] px-14 font-medium text-white hover:bg-[#5B73E8]"
        >
          {CREATE_TEST_ACTIONS.NEXT}
        </LoadingButton>
      </div>
    </form>
  );
}
