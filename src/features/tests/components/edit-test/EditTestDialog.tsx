import { Controller } from 'react-hook-form';
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
  SUBJECT_OPTIONS,
  TOPIC_OPTIONS,
  SUB_TOPIC_OPTIONS,
  EDIT_TEST_DIALOG,
} from '../../constants/test.constants';
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
 * All user-facing strings are pulled from `EDIT_TEST_DIALOG` constants.
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

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogHeader title={EDIT_TEST_DIALOG.TITLE} onClose={handleClose} />

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
                label={EDIT_TEST_DIALOG.LABELS.SUBJECT}
                options={SUBJECT_OPTIONS}
                placeholder={EDIT_TEST_DIALOG.PLACEHOLDERS.DROPDOWN}
                error={errors.subject?.message}
                {...register('subject')}
              />
              <TextField
                label={EDIT_TEST_DIALOG.LABELS.NAME_OF_TEST}
                placeholder={EDIT_TEST_DIALOG.PLACEHOLDERS.TEST_NAME}
                error={errors.title?.message}
                {...register('title')}
              />

              <SelectField
                label={EDIT_TEST_DIALOG.LABELS.TOPIC}
                options={TOPIC_OPTIONS}
                placeholder={EDIT_TEST_DIALOG.PLACEHOLDERS.DROPDOWN}
                error={errors.topic?.message}
                {...register('topic')}
              />
              <SelectField
                label={EDIT_TEST_DIALOG.LABELS.SUB_TOPIC}
                options={SUB_TOPIC_OPTIONS}
                placeholder={EDIT_TEST_DIALOG.PLACEHOLDERS.DROPDOWN}
                error={errors.subTopic?.message}
                {...register('subTopic')}
              />

              <TextField
                label={EDIT_TEST_DIALOG.LABELS.DURATION}
                placeholder={EDIT_TEST_DIALOG.PLACEHOLDERS.DURATION}
                type="number"
                error={errors.duration?.message}
                {...register('duration', { valueAsNumber: true })}
              />
              <Controller
                name="difficultyLevel"
                control={control}
                render={({ field }) => (
                  <RadioGroupField
                    label={EDIT_TEST_DIALOG.LABELS.DIFFICULTY}
                    name={field.name}
                    options={DIFFICULTY_LEVELS}
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.difficultyLevel?.message}
                  />
                )}
              />
            </div>

            {/* Marking Scheme */}
            <div className="space-y-4">
              <h3 className="text-base font-medium text-foreground">
                {EDIT_TEST_DIALOG.LABELS.MARKING_SCHEME}
              </h3>
              <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-3">
                <TextField
                  label={EDIT_TEST_DIALOG.LABELS.WRONG_ANSWER}
                  type="number"
                  placeholder={EDIT_TEST_DIALOG.PLACEHOLDERS.WRONG_ANSWER}
                  error={errors.markingScheme?.wrongAnswer?.message}
                  {...register('markingScheme.wrongAnswer', { valueAsNumber: true })}
                />
                <TextField
                  label={EDIT_TEST_DIALOG.LABELS.UNATTEMPTED}
                  type="number"
                  placeholder={EDIT_TEST_DIALOG.PLACEHOLDERS.UNATTEMPTED}
                  error={errors.markingScheme?.unattempted?.message}
                  {...register('markingScheme.unattempted', { valueAsNumber: true })}
                />
                <TextField
                  label={EDIT_TEST_DIALOG.LABELS.CORRECT_ANSWER}
                  type="number"
                  placeholder={EDIT_TEST_DIALOG.PLACEHOLDERS.CORRECT_ANSWER}
                  error={errors.markingScheme?.correctAnswer?.message}
                  {...register('markingScheme.correctAnswer', { valueAsNumber: true })}
                />
              </div>
            </div>

            {/* Questions & Marks */}
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
              <TextField
                label={EDIT_TEST_DIALOG.LABELS.NO_OF_QUESTIONS}
                type="number"
                placeholder={EDIT_TEST_DIALOG.PLACEHOLDERS.QUESTIONS}
                error={errors.totalQuestions?.message}
                {...register('totalQuestions', { valueAsNumber: true })}
              />
              <TextField
                label={EDIT_TEST_DIALOG.LABELS.TOTAL_MARKS}
                name="totalMarks"
                type="text"
                placeholder={EDIT_TEST_DIALOG.PLACEHOLDERS.MARKS}
                disabled
                className="cursor-not-allowed bg-slate-50"
              />
            </div>
          </div>
        </DialogBody>

        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={isLoading}
            className="bg-slate-50 px-8 text-blue-600 hover:bg-slate-100 hover:text-blue-700"
          >
            {EDIT_TEST_DIALOG.CANCEL}
          </Button>
          <LoadingButton
            type="submit"
            isLoading={isLoading}
            loadingText={EDIT_TEST_DIALOG.SAVING}
            className="bg-blue-500 px-12 hover:bg-blue-600"
          >
            {EDIT_TEST_DIALOG.SAVE}
          </LoadingButton>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
