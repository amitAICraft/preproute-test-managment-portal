import { useEffect, useRef, useState } from 'react';
import { Controller, useWatch } from 'react-hook-form';
import { Dialog, DialogHeader, DialogBody, DialogFooter } from '@/components/ui/dialog';
import { TextField } from '@/components/forms/TextField';
import { SelectField } from '@/components/forms/SelectField';
import { MultiSelectField } from '@/components/forms/MultiSelectField';
import { RadioGroupField } from '@/components/forms/RadioGroupField';
import { Tabs } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LoadingButton } from '@/components/common/LoadingButton';
import { useUpdateTest } from '../../hooks/useUpdateTest';
import { TEST_TYPES, DIFFICULTY_LEVELS, TEST_FORM_CONSTANTS } from '../../constants/test.constants';
import {
  useGetSubjectsQuery,
  useGetTopicsBySubjectQuery,
  useGetSubTopicsQuery,
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

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  const handleClose = () => {
    if (!isLoading) {
      onOpenChange(false);
    }
  };

  const [hasPrefilledSubject, setHasPrefilledSubject] = useState(false);
  const [hasPrefilledTopics, setHasPrefilledTopics] = useState(false);
  const [hasPrefilledSubTopics, setHasPrefilledSubTopics] = useState(false);

  // Reset prefill state when modal closes
  useEffect(() => {
    if (!open) {
      setHasPrefilledSubject(false);
      setHasPrefilledTopics(false);
      setHasPrefilledSubTopics(false);
      form.reset();
    }
  }, [open, form]);

  // 1. Prefill basic fields (non-taxonomy)
  useEffect(() => {
    if (existingTest && open && !hasPrefilledSubject) {
      form.reset({
        id: existingTest.id,
        testType: existingTest.testType,
        title: existingTest.title,
        duration: existingTest.duration,
        difficultyLevel: existingTest.difficultyLevel,
        markingScheme: { ...existingTest.markingScheme },
        totalQuestions: existingTest.totalQuestions,
        subject: '',
        topics: [],
        subTopics: [],
      });
    }
  }, [existingTest, open, form, hasPrefilledSubject]);

  const { data: subjects = [] } = useGetSubjectsQuery(undefined, { skip: !open });

  // 2. Prefill Subject (mapping name to id)
  useEffect(() => {
    if (existingTest && open && !hasPrefilledSubject && subjects.length > 0) {
      const sId = subjects.find((s) => s.name === existingTest.subject)?.id;
      if (sId) {
        form.setValue('subject', sId);
      }
      setHasPrefilledSubject(true);
    }
  }, [existingTest, open, hasPrefilledSubject, subjects, form]);

  const selectedSubject = useWatch({ control, name: 'subject' });

  const { data: topics = [] } = useGetTopicsBySubjectQuery(selectedSubject, {
    skip: !selectedSubject || !open,
  });

  // 3. Prefill Topics (mapping names to ids)
  useEffect(() => {
    if (existingTest && open && hasPrefilledSubject && !hasPrefilledTopics && topics.length > 0) {
      const tIds = topics.filter((t) => existingTest.topics.includes(t.name)).map((t) => t.id);
      if (tIds.length > 0) {
        form.setValue('topics', tIds);
      }
      setHasPrefilledTopics(true);
    }
  }, [existingTest, open, hasPrefilledSubject, hasPrefilledTopics, topics, form]);

  const selectedTopics = useWatch({ control, name: 'topics' });

  const { data: subTopics = [] } = useGetSubTopicsQuery(
    selectedTopics?.length ? selectedTopics : [],
    {
      skip: !selectedTopics?.length || !open,
    },
  );

  // Clear subTopics whenever Topic selection CHANGES (not just when empty)
  // Use a ref to track previous value and skip the initial prefill trigger
  const prevTopicsRef = useRef<string[]>([]);
  useEffect(() => {
    const prev = prevTopicsRef.current;
    const curr = selectedTopics ?? [];
    // Skip clearing during initial prefill (prev is empty and we're adding topics)
    const isInitialLoad = prev.length === 0 && curr.length > 0 && !hasPrefilledSubTopics;
    if (!isInitialLoad) {
      const changed = curr.length !== prev.length || curr.some((t, i) => t !== prev[i]);
      if (changed) {
        form.setValue('subTopics', []);
        if (curr.length > 0) {
          // Reset the subtopic prefill flag so new topics can trigger refetch
          setHasPrefilledSubTopics(false);
        }
      }
    }
    prevTopicsRef.current = curr;
  }, [selectedTopics, form, hasPrefilledSubTopics]);

  // 4. Prefill SubTopics (mapping names to ids)
  useEffect(() => {
    if (
      existingTest &&
      open &&
      hasPrefilledTopics &&
      !hasPrefilledSubTopics &&
      subTopics.length > 0
    ) {
      const stIds = subTopics
        .filter((st) => existingTest.subTopics?.includes(st.name))
        .map((st) => st.id);
      if (stIds.length > 0) {
        form.setValue('subTopics', stIds);
      }
      setHasPrefilledSubTopics(true);
    }
  }, [existingTest, open, hasPrefilledTopics, hasPrefilledSubTopics, subTopics, form]);

  const totalMarks = existingTest?.totalMarks || 0;

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
                  <Tabs options={TEST_TYPES} value={field.value} onChange={field.onChange} />
                )}
              />
              {errors.testType && (
                <p className="text-destructive mt-2 text-sm">{errors.testType.message}</p>
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
              <h3 className="text-foreground text-base font-medium">
                {TEST_FORM_CONSTANTS.LABELS.MARKING_SCHEME}
              </h3>
              <div className="grid grid-cols-1 items-end gap-x-6 gap-y-6 md:grid-cols-12">
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
            className="bg-[#f4f6ff] px-8 font-medium hover:bg-indigo-50"
            style={{ color: '#7489FF' }}
          >
            {TEST_FORM_CONSTANTS.CANCEL}
          </Button>
          <LoadingButton
            type="submit"
            isLoading={isLoading}
            loadingText={TEST_FORM_CONSTANTS.SAVING}
            className="px-12 font-medium"
            style={{ backgroundColor: '#7489FF', color: '#FFFFFF' }}
          >
            {TEST_FORM_CONSTANTS.SAVE}
          </LoadingButton>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
