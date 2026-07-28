import { Controller, useWatch } from 'react-hook-form';
import { Dialog, DialogHeader, DialogBody, DialogFooter } from '@/components/ui/dialog';
import { TextField } from '@/components/forms/TextField';
import { SelectField } from '@/components/forms/SelectField';
import { RadioGroupField } from '@/components/forms/RadioGroupField';
import { Tabs } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LoadingButton } from '@/components/common/LoadingButton';
import { useUpdateTest } from '../../hooks/useUpdateTest';
import {
  TEST_TYPES,
  DIFFICULTY_LEVELS,
  TEST_FORM_CONSTANTS,
} from '../../constants/test.constants';
import { 
  useGetSubjectsQuery, 
  useGetTopicsBySubjectQuery, 
  useGetSubTopicsQuery 
} from '@/services/taxonomyApi';
import type { Test } from '../../types';

interface EditTestDialogProps {
  /** Controls dialog visibility. */
  open: boolean;
  /** Called when the dialog requests to close. */
  onOpenChange: (open: boolean) => void;
  /** The test entity to edit. When undefined, the form shows empty defaults. */
  existingTest: Test | undefined;
}

/**
 * Edit Test Details modal dialog.
 *
 * Reuses the `useUpdateTest` hook for business logic and validation,
 * and renders the same form fields as the Create Test form.
 * All user-facing strings are pulled from `TEST_FORM_CONSTANTS` constants.
 */
export function EditTestDialog({ open, onOpenChange, existingTest }: EditTestDialogProps) {
  const { form, onSubmit, isLoading } = useUpdateTest(existingTest, {
    onSuccess: () => {
      onOpenChange(false);
    },
  });

  const { register, control, handleSubmit, formState: { errors } } = form;

  const handleClose = () => {
    if (!isLoading) {
      onOpenChange(false);
    }
  };

  const selectedSubject = useWatch({ control, name: 'subject' });
  const selectedTopic = useWatch({ control, name: 'topic' });

  const { data: subjects = [] } = useGetSubjectsQuery(undefined, { skip: !open });
  const { data: topics = [] } = useGetTopicsBySubjectQuery(selectedSubject, {
    skip: !selectedSubject || !open,
  });
  const { data: subTopics = [] } = useGetSubTopicsQuery(selectedTopic ? [selectedTopic] : [], {
    skip: !selectedTopic || !open,
  });

  const subjectOptions = subjects.map((s) => ({ label: s.name, value: s.id }));
  const topicOptions = topics.map((t) => ({ label: t.name, value: t.id }));
  const subTopicOptions = subTopics.map((st) => ({ label: st.name, value: st.id }));

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogHeader title={TEST_FORM_CONSTANTS.TITLE} onClose={handleClose} />

        <DialogBody>
          <div className="space-y-8">
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

            {/* Two-column form grid */}
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
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

            {/* Marking Scheme & Questions */}
            <div className="space-y-4">
              <h3 className="text-base font-medium text-foreground">
                {TEST_FORM_CONSTANTS.LABELS.MARKING_SCHEME}
              </h3>
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
                    className="cursor-not-allowed bg-slate-50"
                  />
                </div>
              </div>
            </div>
          </div>
        </DialogBody>

        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={isLoading}
            className="bg-[#f4f6ff] px-8 text-blue-600 hover:bg-indigo-50 hover:text-blue-700"
          >
            {TEST_FORM_CONSTANTS.CANCEL}
          </Button>
          <LoadingButton
            type="submit"
            isLoading={isLoading}
            loadingText={TEST_FORM_CONSTANTS.SAVING}
            className="bg-blue-500 px-12 hover:bg-blue-600"
          >
            {TEST_FORM_CONSTANTS.SAVE}
          </LoadingButton>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
