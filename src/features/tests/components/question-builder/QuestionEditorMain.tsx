import { useState } from 'react';
import { FormProvider, useWatch } from 'react-hook-form';
import { Trash2, ChevronLeft, ChevronRight, Plus, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TestDetailsCard } from '../TestDetailsCard';
import { EditTestDialog } from '../edit-test/EditTestDialog';
import { RichTextEditor } from '@/components/ui/RichTextEditor';
import { OptionField } from '@/components/forms/OptionField';
import { SelectField } from '@/components/forms/SelectField';
import { Controller } from 'react-hook-form';
import {
  QUESTION_BUILDER_MESSAGES,
  DIFFICULTY_OPTIONS,
} from '../../constants/questionBuilder.constants';
import { useQuestionBuilder } from '../../hooks/useQuestionBuilder';
import {
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

  // Wire Question Settings dropdowns to the test's real taxonomy
  const selectedTopic = useWatch({ control: form.control, name: 'topic' });
  const { data: topics = [] } = useGetTopicsBySubjectQuery(test?.subject || '', {
    skip: !test?.subject,
  });
  const { data: subTopics = [] } = useGetSubTopicsQuery(
    selectedTopic ? [selectedTopic] : (test?.topic ? [test.topic] : []),
    { skip: !selectedTopic && !test?.topic },
  );
  const topicOptions = topics.map((t) => ({ label: t.name, value: t.id }));
  const subTopicOptions = subTopics.map((st) => ({ label: st.name, value: st.id }));

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-slate-50/30">
      <div className="w-full px-6 py-4 space-y-5">
        {/* Test Details Card */}
        <TestDetailsCard onEdit={() => setEditDialogOpen(true)} test={test} />
        <EditTestDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          existingTest={test}
        />

        {/* Editor Area */}
        <FormProvider {...form}>
          <div className="space-y-6">
            
            {/* Header: Question Number and MCQ/CSV Actions */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">
                Question {activeQuestionIndex + 1}<span className="text-slate-400 font-normal">/{totalQuestions}</span>
              </h2>
              {/* Fix 7: MCQ and CSV disabled grey buttons */}
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
            
            {/* Fix 8: Delete All Edits disabled initially, enabled when form is dirty */}
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

            {/* Options */}
            <div className="space-y-3">
              <h3 className="font-semibold">{QUESTION_BUILDER_MESSAGES.OPTIONS_HEADING}</h3>
              {options.map((opt, index) => (
                <OptionField
                  key={opt.id}
                  id={opt.id}
                  text={opt.text}
                  isCorrect={correctOptionId === opt.id}
                  onTextChange={(val) => {
                    const newOpts = [...options];
                    if (newOpts[index]) {
                      newOpts[index].text = val;
                      setValue('options', newOpts, { shouldDirty: true });
                    }
                  }}
                  onSelectCorrect={() => setValue('correctOptionId', opt.id, { shouldDirty: true })}
                  onDelete={() => {
                    const newOpts = options.filter((_, i) => i !== index);
                    setValue('options', newOpts, { shouldDirty: true });
                  }}
                />
              ))}
            </div>

            {/* Solution */}
            <div className="space-y-3">
              <h3 className="font-semibold">{QUESTION_BUILDER_MESSAGES.ADD_SOLUTION}</h3>
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
            <div className="flex items-center justify-center gap-8 py-4">
              <button className="text-slate-400 hover:text-slate-600">
                <ChevronLeft className="size-5" />
              </button>
              <button className="text-slate-400 hover:text-slate-600">
                <ChevronRight className="size-5" />
              </button>
            </div>

            {/* Question Settings */}
            <div className="space-y-4 pt-4">
              <h3 className="font-semibold">{QUESTION_BUILDER_MESSAGES.QUESTION_SETTINGS}</h3>
              
              <div className="space-y-4">
                <SelectField
                  name="difficulty"
                  label={QUESTION_BUILDER_MESSAGES.LEVEL_OF_DIFFICULTY}
                  options={DIFFICULTY_OPTIONS}
                />
                
                <SelectField
                  name="topic"
                  label={QUESTION_BUILDER_MESSAGES.TOPIC}
                  options={topicOptions}
                />
                
                <SelectField
                  name="subTopic"
                  label={QUESTION_BUILDER_MESSAGES.SUB_TOPIC}
                  options={subTopicOptions}
                />
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-8 pb-4">
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
    </div>
  );
}
