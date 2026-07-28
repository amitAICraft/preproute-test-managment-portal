import { useState, useEffect } from 'react';
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

interface QuestionEditorMainProps {
  activeQuestionIndex: number;
  totalQuestions: number;
  testId?: string;
  test?: Test;
  onSaveSuccess?: () => void;
}

export function QuestionEditorMain({ activeQuestionIndex, totalQuestions, testId, test, onSaveSuccess }: QuestionEditorMainProps) {
  const { form, handleNext, handleDeleteAllEdits } = useQuestionBuilder(testId, onSaveSuccess);
  const { watch, setValue, formState: { isDirty } } = form;
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const options = watch('options') || [];
  const correctOptionId = watch('correctOptionId');

  // ── Dependent Taxonomy Loading for Question Settings (Topic / Sub-Topic) ──
  const { data: subjects = [] } = useGetSubjectsQuery();
  
  // Find real subjectId from subject name or ID
  const currentSubjectObj = subjects.find(
    (s) => s.id === test?.subject || s.name.toLowerCase() === test?.subject?.toLowerCase()
  );
  const subjectId = currentSubjectObj?.id || test?.subject || '';

  // Fetch topics for this subject
  const { data: topics = [] } = useGetTopicsBySubjectQuery(subjectId, {
    skip: !subjectId,
  });

  // Watch topic in form or fallback to test.topic
  const selectedTopicInForm = useWatch({ control: form.control, name: 'topic' });
  const currentTopicObj = topics.find(
    (t) =>
      t.id === selectedTopicInForm ||
      t.name.toLowerCase() === selectedTopicInForm?.toLowerCase() ||
      t.id === test?.topic ||
      (test?.topic && t.name.toLowerCase() === test.topic.toLowerCase())
  );
  const topicId = currentTopicObj?.id || selectedTopicInForm || test?.topic || '';

  // Fetch sub-topics for topicId
  const { data: subTopics = [] } = useGetSubTopicsQuery(
    topicId ? [topicId] : [],
    { skip: !topicId }
  );

  const topicOptions = topics.map((t) => ({ label: t.name, value: t.name }));
  const subTopicOptions = subTopics.map((st) => ({ label: st.name, value: st.name }));

  // Pre-fill Question Settings when test / taxonomy data arrives
  useEffect(() => {
    if (test) {
      if (test.difficultyLevel && !form.getValues('difficulty')) {
        form.setValue('difficulty', test.difficultyLevel);
      }
      if (test.topic && !form.getValues('topic')) {
        const foundTopic = topics.find(
          (t) => t.id === test.topic || (test.topic && t.name.toLowerCase() === test.topic.toLowerCase())
        );
        form.setValue('topic', foundTopic?.name || test.topic);
      }
      if (test.subTopic && !form.getValues('subTopic')) {
        const foundSubTopic = subTopics.find(
          (st) => st.id === test.subTopic || (test.subTopic && st.name.toLowerCase() === test.subTopic.toLowerCase())
        );
        form.setValue('subTopic', foundSubTopic?.name || test.subTopic);
      }
    }
  }, [test, topics, subTopics, form]);

  return (
    <div className="flex-1 min-w-0 flex flex-col space-y-5">
      {/* Test Details Card */}
      <TestDetailsCard onEdit={() => setEditDialogOpen(true)} test={test} />
      <EditTestDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        existingTest={test}
      />

      {/* Editor Area */}
      <FormProvider {...form}>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
          
          {/* Header: Question Number and MCQ/CSV Actions */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              Question {activeQuestionIndex + 1}<span className="text-slate-400 font-normal">/{totalQuestions}</span>
            </h2>
            {/* MCQ and CSV disabled grey buttons */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                disabled
                className="gap-2 bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-75"
              >
                <Plus className="size-4" /> MCQ
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled
                className="gap-2 bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-75"
              >
                <Download className="size-4" /> CSV
              </Button>
            </div>
          </div>
          
          {/* Delete All Edits disabled initially, enabled when form is dirty */}
          <div className="flex justify-start">
            <Button 
              variant="ghost" 
              disabled={!isDirty}
              className={cn(
                "p-0 h-auto gap-2 text-sm font-medium transition-colors",
                isDirty
                  ? "text-red-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                  : "text-slate-300 cursor-not-allowed opacity-60 hover:bg-transparent"
              )}
              onClick={handleDeleteAllEdits}
            >
              <Trash2 className="size-4" />
              {QUESTION_BUILDER_MESSAGES.DELETE_ALL_EDITS}
            </Button>
          </div>

          {/* Question Text Editor */}
          <Controller
            name="questionText"
            control={form.control}
            render={({ field }) => (
              <RichTextEditor
                value={field.value}
                onChange={field.onChange}
                placeholder={QUESTION_BUILDER_MESSAGES.PLACEHOLDERS.EDITOR}
                className="min-h-[150px]"
              />
            )}
          />

          {/* Options Section — Editable with immutable array updates */}
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-800">{QUESTION_BUILDER_MESSAGES.OPTIONS_HEADING}</h3>
            {options.map((opt, index) => (
              <OptionField
                key={opt.id}
                id={opt.id}
                text={opt.text}
                isCorrect={correctOptionId === opt.id}
                onTextChange={(val) => {
                  const newOpts = options.map((item, i) => (i === index ? { ...item, text: val } : item));
                  setValue('options', newOpts, { shouldDirty: true, shouldTouch: true });
                }}
                onSelectCorrect={() => setValue('correctOptionId', opt.id, { shouldDirty: true, shouldTouch: true })}
                onDelete={() => {
                  const newOpts = options.filter((_, i) => i !== index);
                  setValue('options', newOpts, { shouldDirty: true, shouldTouch: true });
                }}
              />
            ))}
          </div>

          {/* Solution Section — Rich Text Editor bound via Controller */}
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-800">{QUESTION_BUILDER_MESSAGES.ADD_SOLUTION}</h3>
            <Controller
              name="solutionText"
              control={form.control}
              render={({ field }) => (
                <RichTextEditor
                  value={field.value || ''}
                  onChange={field.onChange}
                  placeholder={QUESTION_BUILDER_MESSAGES.PLACEHOLDERS.EDITOR}
                  className="min-h-[120px]"
                />
              )}
            />
          </div>

          {/* Pagination controls */}
          <div className="flex items-center justify-center gap-8 py-2">
            <button type="button" className="text-slate-400 hover:text-slate-600 transition-colors">
              <ChevronLeft className="size-5" />
            </button>
            <button type="button" className="text-slate-400 hover:text-slate-600 transition-colors">
              <ChevronRight className="size-5" />
            </button>
          </div>

          {/* Question Settings */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <h3 className="font-semibold text-slate-800">{QUESTION_BUILDER_MESSAGES.QUESTION_SETTINGS}</h3>
            
            <div className="space-y-4">
              <SelectField
                label={QUESTION_BUILDER_MESSAGES.LEVEL_OF_DIFFICULTY}
                options={DIFFICULTY_OPTIONS}
                error={form.formState.errors.difficulty?.message}
                {...form.register('difficulty')}
              />
              
              <SelectField
                label={QUESTION_BUILDER_MESSAGES.TOPIC}
                options={topicOptions}
                placeholder="Select from Drop-down"
                error={form.formState.errors.topic?.message}
                {...form.register('topic')}
              />
              
              <SelectField
                label={QUESTION_BUILDER_MESSAGES.SUB_TOPIC}
                options={subTopicOptions}
                placeholder="Select from Drop-down"
                error={form.formState.errors.subTopic?.message}
                {...form.register('subTopic')}
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-6 pb-2">
            <Button variant="destructive" className="bg-[#FF6B6B] hover:bg-[#E55555] font-medium px-6 h-10 rounded-lg">
              {QUESTION_BUILDER_MESSAGES.EXIT_TEST_CREATION}
            </Button>
            
            <Button onClick={handleNext} className="bg-[#7489FF] hover:bg-[#5B73E8] font-medium px-8 h-10 rounded-lg">
              {QUESTION_BUILDER_MESSAGES.NEXT}
            </Button>
          </div>

        </div>
      </FormProvider>
    </div>
  );
}
