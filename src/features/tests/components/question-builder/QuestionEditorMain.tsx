import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { FormProvider, useWatch, Controller } from 'react-hook-form';
import { Trash2, ChevronLeft, ChevronRight, Plus, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TestDetailsCard } from '../TestDetailsCard';
import { EditTestDialog } from '../edit-test/EditTestDialog';
import { RichTextEditor } from '@/components/ui/RichTextEditor';
import { OptionField } from '@/components/forms/OptionField';
import { SelectField } from '@/components/forms/SelectField';
import {
  QUESTION_BUILDER_MESSAGES,
  DIFFICULTY_OPTIONS,
} from '../../constants/questionBuilder.constants';
import { useQuestionBuilder } from '../../hooks/useQuestionBuilder';
import {
  useGetSubjectsQuery,
  useGetTopicsBySubjectQuery,
  useGetSubTopicsQuery,
} from '@/services/taxonomyApi';
import type { Test } from '../../types/test.types';
import { cn } from '@/lib/utils';

import type { Question } from '@/services/questionApi';
import type { QuestionBuilderFormValues } from '../../schemas/questionBuilderSchema';

interface QuestionEditorMainProps {
  activeQuestionIndex: number;
  totalQuestions: number;
  testId?: string;
  test?: Test;
  questions?: Question[];
  draftQuestions?: Record<number, any>;
  setDraftQuestions?: React.Dispatch<React.SetStateAction<Record<number, any>>>;
  onSaveSuccess?: () => void;
}

export function QuestionEditorMain({
  activeQuestionIndex,
  totalQuestions,
  testId,
  test,
  questions = [],
  draftQuestions = {},
  setDraftQuestions,
  onSaveSuccess,
}: QuestionEditorMainProps) {
  // Stable references for taxonomy arrays when undefined
  const { data: subjectsData } = useGetSubjectsQuery();
  const subjects = subjectsData || [];

  // Find real subjectId from subject name or ID
  const currentSubjectObj = subjects.find(
    (s) => s.id === test?.subject || s.name.toLowerCase() === test?.subject?.toLowerCase(),
  );
  const subjectId = currentSubjectObj?.id || test?.subject || '';

  const savedQ = questions[activeQuestionIndex];
  const isReadOnly = !!savedQ;

  const { form, handleNext, handleDeleteAllEdits } = useQuestionBuilder(
    testId,
    subjectId,
    // Provide functions to get the set of valid topic/subTopic UUIDs dynamically.
    // This resolves Temporal Dead Zone issues during form/state initialization.
    () => topics.map((t) => t.id),
    () => subTopics.map((st) => st.id),
    onSaveSuccess,
  );
  const {
    watch,
    setValue,
    formState: { isDirty },
  } = form;
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const navigate = useNavigate();

  const options = watch('options') || [];
  const correctOptionId = watch('correctOptionId');

  // Fetch topics for this subject
  const { data: topicsData } = useGetTopicsBySubjectQuery(subjectId, {
    skip: !subjectId,
  });
  const topics = topicsData || [];

  // Watch topic in form or fallback to test.topic
  const selectedTopicInForm = useWatch({ control: form.control, name: 'topic' });
  const currentTopicObj = topics.find(
    (t) =>
      t.id === selectedTopicInForm ||
      t.name.toLowerCase() === selectedTopicInForm?.toLowerCase() ||
      t.id === test?.topics?.[0] ||
      (test?.topics?.[0] && t.name.toLowerCase() === test.topics[0].toLowerCase()),
  );
  // topicId for sub-topic fetching: MUST be a UUID from the loaded topics list.
  // currentTopicObj.id is the only safe source — never fall back to test.topics[0]
  // because that field stores display names, not UUIDs.
  const topicId = currentTopicObj?.id || '';

  // Fetch sub-topics for topicId
  const { data: subTopicsData } = useGetSubTopicsQuery(topicId ? [topicId] : [], {
    skip: !topicId,
  });
  const subTopics = subTopicsData || [];

  const topicOptions = topics.map((t) => ({ label: t.name, value: t.id }));
  const subTopicOptions = subTopics.map((st) => ({ label: st.name, value: st.id }));

  // Resolve the test's default topic/subTopic names → UUIDs.
  // test.topics[] and test.subTopics[] store display names, NOT ids.
  // Only use a value if it resolves to an actual UUID in the loaded taxonomy.
  const defaultTopicId = currentTopicObj?.id || '';
  const defaultSubTopicObj = subTopics.find(
    (st) =>
      st.id === test?.subTopics?.[0] ||
      (test?.subTopics?.[0] && st.name.toLowerCase() === test.subTopics[0].toLowerCase()),
  );
  const defaultSubTopicId = defaultSubTopicObj?.id || '';

  const firstSubTopicId = subTopics.length > 0 ? subTopics[0]?.id : undefined;

  // Sync form state when switching questions or when questions data arrives
  // Only run when activeQuestionIndex or questions array changes, to avoid resetting form while typing.
  useEffect(() => {
    const draft = draftQuestions[activeQuestionIndex];
    const savedQ = questions[activeQuestionIndex];

    if (draft) {
      form.reset(draft as QuestionBuilderFormValues);
    } else if (savedQ) {
      form.reset({
        questionText: savedQ.text,
        options: savedQ.options.map((o) => ({ id: o.id, text: o.text })),
        correctOptionId: savedQ.correctAnswer,
        solutionText: savedQ.explanation || '',
        difficulty: savedQ.difficulty || test?.difficultyLevel || 'easy',
        // Use resolved UUIDs — never fall back to test.topics[] name strings
        topic: defaultTopicId,
        subTopic: defaultSubTopicId,
      });
    } else {
      // New question defaults
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
        difficulty: test?.difficultyLevel || 'easy',
        // Use resolved UUID only — never fall back to test.topics[] name strings
        topic: defaultTopicId,
        subTopic: defaultSubTopicId || firstSubTopicId || '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeQuestionIndex, questions]); // Deliberately limited to prevent reset on typing

  // Save drafts when form changes
  useEffect(() => {
    const subscription = watch((value) => {
      if (setDraftQuestions) {
        setDraftQuestions((prev) => ({
          ...prev,
          [activeQuestionIndex]: value,
        }));
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, activeQuestionIndex, setDraftQuestions]);

  // Inform the user when they open a previously saved (read-only) question
  useEffect(() => {
    if (isReadOnly) {
      toast.info(
        'Editing previously saved questions is currently unavailable because the backend does not support question updates.',
        { duration: 5000 },
      );
    }
    // Only re-fire when the active index changes, not on every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeQuestionIndex]);

  return (
    <div className="flex min-w-0 flex-1 flex-col space-y-5">
      {/* Test Details Card */}
      <TestDetailsCard onEdit={() => setEditDialogOpen(true)} test={test} />
      <EditTestDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} existingTest={test} />

      {/* Editor Area */}
      <FormProvider {...form}>
        <div className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
          {/* Header: Question Number and MCQ/CSV Actions */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              Question {activeQuestionIndex + 1}
              <span className="font-normal text-slate-400">/{totalQuestions}</span>
            </h2>
            {/* MCQ and CSV disabled grey buttons */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                disabled
                className="cursor-not-allowed gap-2 border-slate-200 bg-slate-100 text-slate-400 opacity-75"
              >
                <Plus className="size-4" /> MCQ
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled
                className="cursor-not-allowed gap-2 border-slate-200 bg-slate-100 text-slate-400 opacity-75"
              >
                <Download className="size-4" /> CSV
              </Button>
            </div>
          </div>

          {/* Delete All Edits disabled initially, enabled when form is dirty */}
          <div className="flex justify-start">
            <Button
              variant="ghost"
              disabled={!isDirty || isReadOnly}
              className={cn(
                'h-auto gap-2 p-0 text-sm font-medium transition-colors',
                isDirty && !isReadOnly
                  ? 'cursor-pointer text-red-500 hover:bg-red-50 hover:text-red-600'
                  : 'cursor-not-allowed text-slate-300 opacity-60 hover:bg-transparent',
              )}
              onClick={handleDeleteAllEdits}
            >
              <Trash2 className="size-4" />
              {QUESTION_BUILDER_MESSAGES.DELETE_ALL_EDITS}
            </Button>
          </div>

          {/* Question Text Editor */}
          <div className="space-y-1">
            <Controller
              name="questionText"
              control={form.control}
              render={({ field }) => (
                <RichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={QUESTION_BUILDER_MESSAGES.PLACEHOLDERS.EDITOR}
                  className="min-h-[150px]"
                  error={form.formState.errors.questionText?.message}
                  disabled={isReadOnly}
                />
              )}
            />
            {form.formState.errors.questionText && (
              <p className="text-sm text-red-500">{form.formState.errors.questionText.message}</p>
            )}
          </div>

          {/* Options Section — Editable with immutable array updates */}
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-800">
              {QUESTION_BUILDER_MESSAGES.OPTIONS_HEADING}
            </h3>
            {options.map((opt, index) => (
              <div key={opt.id} className="space-y-1">
                <OptionField
                  id={opt.id}
                  text={opt.text}
                  isCorrect={correctOptionId === opt.id}
                  disabled={isReadOnly}
                  onTextChange={(val) => {
                    const newOpts = options.map((item, i) =>
                      i === index ? { ...item, text: val } : item,
                    );
                    setValue('options', newOpts, { shouldDirty: true, shouldTouch: true });
                  }}
                  onSelectCorrect={() =>
                    setValue('correctOptionId', opt.id, { shouldDirty: true, shouldTouch: true })
                  }
                  onDelete={
                    options.length > 2 && !isReadOnly
                      ? () => {
                          const newOpts = options.filter((_, i) => i !== index);
                          setValue('options', newOpts, { shouldDirty: true, shouldTouch: true });
                        }
                      : undefined
                  }
                />
                {form.formState.errors.options?.[index]?.text && (
                  <p className="text-sm text-red-500">{form.formState.errors.options[index]?.text?.message}</p>
                )}
              </div>
            ))}
            {form.formState.errors.correctOptionId && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.correctOptionId.message}</p>
            )}
          </div>

          {/* Solution Section — Plain Textarea */}
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-800">
              {QUESTION_BUILDER_MESSAGES.ADD_SOLUTION}
            </h3>
            <textarea
              className={cn(
                "min-h-[120px] w-full resize-y rounded-lg border border-slate-200 p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#7489FF] focus:outline-none focus:ring-1 focus:ring-[#7489FF]",
                isReadOnly ? "bg-slate-50 border-slate-200 cursor-not-allowed opacity-75 focus:ring-0" : "bg-white"
              )}
              placeholder={QUESTION_BUILDER_MESSAGES.PLACEHOLDERS.EDITOR}
              disabled={isReadOnly}
              {...form.register('solutionText')}
            />
          </div>

          {/* Pagination controls */}
          <div className="flex items-center justify-center gap-8 py-2">
            <button type="button" className="text-slate-400 transition-colors hover:text-slate-600">
              <ChevronLeft className="size-5" />
            </button>
            <button type="button" className="text-slate-400 transition-colors hover:text-slate-600">
              <ChevronRight className="size-5" />
            </button>
          </div>

          {/* Question Settings */}
          <div className="space-y-4 border-t border-slate-100 pt-2">
            <h3 className="font-semibold text-slate-800">
              {QUESTION_BUILDER_MESSAGES.QUESTION_SETTINGS}
            </h3>

            <div className="space-y-4">
              <SelectField
                label={QUESTION_BUILDER_MESSAGES.LEVEL_OF_DIFFICULTY}
                options={DIFFICULTY_OPTIONS}
                error={form.formState.errors.difficulty?.message}
                disabled={isReadOnly}
                {...form.register('difficulty')}
              />

              <SelectField
                label={QUESTION_BUILDER_MESSAGES.TOPIC}
                options={topicOptions}
                placeholder="Select from Drop-down"
                error={form.formState.errors.topic?.message}
                disabled={isReadOnly}
                {...form.register('topic')}
              />

              <SelectField
                label={QUESTION_BUILDER_MESSAGES.SUB_TOPIC}
                options={subTopicOptions}
                placeholder="Select from Drop-down"
                error={form.formState.errors.subTopic?.message}
                disabled={isReadOnly}
                {...form.register('subTopic')}
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-6 pb-2">
            <Button
              type="button"
              variant="destructive"
              disabled={isReadOnly}
              className={cn(
                'h-10 rounded-lg px-6 font-medium',
                isReadOnly
                  ? 'cursor-not-allowed bg-[#FF6B6B]/40 opacity-60'
                  : 'bg-[#FF6B6B] hover:bg-[#E55555]',
              )}
              onClick={() => !isReadOnly && navigate('/tests/create')}
            >
              {QUESTION_BUILDER_MESSAGES.EXIT_TEST_CREATION}
            </Button>

            <Button
              disabled={isReadOnly}
              onClick={isReadOnly ? undefined : handleNext}
              className={cn(
                'h-10 rounded-lg px-8 font-medium',
                isReadOnly
                  ? 'cursor-not-allowed bg-[#7489FF]/40 opacity-60'
                  : 'bg-[#7489FF] hover:bg-[#5B73E8]',
              )}
            >
              {QUESTION_BUILDER_MESSAGES.NEXT}
            </Button>
          </div>
        </div>
      </FormProvider>
    </div>
  );
}
