import { useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
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
  TOPIC_OPTIONS,
  SUB_TOPIC_OPTIONS,
} from '../../constants/questionBuilder.constants';
import { useQuestionBuilder } from '../../hooks/useQuestionBuilder';
interface QuestionEditorMainProps {
  activeQuestionIndex: number;
  totalQuestions: number;
}

export function QuestionEditorMain({ activeQuestionIndex, totalQuestions }: QuestionEditorMainProps) {
  const { form, handleNext, handleDeleteAllEdits } = useQuestionBuilder();
  const { watch, setValue } = form;
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const options = watch('options') || [];
  const correctOptionId = watch('correctOptionId');

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-slate-50/30">
      <div className="mx-auto w-full max-w-4xl p-6 space-y-6">
        {/* Test Details Card */}
        <TestDetailsCard onEdit={() => setEditDialogOpen(true)} />
        <EditTestDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          existingTest={undefined}
        />

        {/* Editor Area */}
        <FormProvider {...form}>
          <div className="space-y-6">
            
            {/* Header: Question Number and Actions */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">
                Question {activeQuestionIndex + 1}<span className="text-slate-400 font-normal">/{totalQuestions}</span>
              </h2>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="gap-2 text-slate-600">
                  <span className="text-lg font-light">+</span> MCQ
                </Button>
                <Button variant="outline" size="sm" className="gap-2 text-slate-600">
                  <span className="text-lg font-light">↓</span> CSV
                </Button>
              </div>
            </div>
            
            <div className="flex justify-start">
              <Button 
                variant="ghost" 
                className="text-red-500 hover:text-red-600 hover:bg-red-50 p-0 h-auto gap-2 text-sm font-medium"
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
                      setValue('options', newOpts);
                    }
                  }}
                  onSelectCorrect={() => setValue('correctOptionId', opt.id)}
                  onDelete={() => {
                    const newOpts = options.filter((_, i) => i !== index);
                    setValue('options', newOpts);
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
                  options={TOPIC_OPTIONS}
                />
                
                <SelectField
                  name="subTopic"
                  label={QUESTION_BUILDER_MESSAGES.SUB_TOPIC}
                  options={SUB_TOPIC_OPTIONS}
                />
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-8 pb-4">
              <Button variant="destructive" className="bg-red-400 hover:bg-red-500 font-medium">
                {QUESTION_BUILDER_MESSAGES.EXIT_TEST_CREATION}
              </Button>
              
              <Button onClick={handleNext} className="bg-blue-500 hover:bg-blue-600 font-medium px-8">
                {QUESTION_BUILDER_MESSAGES.NEXT}
              </Button>
            </div>

          </div>
        </FormProvider>
      </div>
    </div>
  );
}
