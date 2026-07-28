import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { QUESTION_BUILDER_MESSAGES } from '../../constants/questionBuilder.constants';
import { cn } from '@/lib/utils';

interface QuestionListSidebarProps {
  totalQuestions: number;
  activeQuestionIndex: number;
  completedQuestions: number[];
  onSelectQuestion: (index: number) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function QuestionListSidebar({
  totalQuestions,
  activeQuestionIndex,
  completedQuestions,
  onSelectQuestion,
  isCollapsed = false,
  onToggleCollapse,
}: QuestionListSidebarProps) {
  // Generate dummy list of 50
  const questions = Array.from({ length: totalQuestions }, (_, i) => i);

  return (
    <div
      className={cn(
        'flex h-full flex-col border-r border-slate-200 bg-white transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="flex h-14 items-center justify-between border-b border-slate-200 px-4">
        {!isCollapsed && (
          <h2 className="text-sm font-semibold text-slate-800">
            {QUESTION_BUILDER_MESSAGES.TITLE}
          </h2>
        )}
        <button
          onClick={onToggleCollapse}
          className={cn(
            'flex size-6 items-center justify-center rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors',
            isCollapsed && 'mx-auto'
          )}
        >
          {isCollapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
          {!isCollapsed && <ChevronLeft className="size-4 -ml-2" />}
        </button>
      </div>

      {/* Subheader */}
      {!isCollapsed && (
        <div className="px-4 py-3 text-sm text-slate-500">
          {QUESTION_BUILDER_MESSAGES.TOTAL_QUESTIONS} . {totalQuestions}
        </div>
      )}

      {/* List */}
      <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1 custom-scrollbar">
        {questions.map((index) => {
          const isCompleted = completedQuestions.includes(index);
          const isActive = index === activeQuestionIndex;

          if (isCollapsed) {
            return (
              <button
                key={index}
                onClick={() => onSelectQuestion(index)}
                className={cn(
                  'mx-auto mt-2 flex size-8 items-center justify-center rounded-full border text-xs',
                  isCompleted
                    ? 'border-emerald-500 text-emerald-500'
                    : 'border-slate-200 text-slate-300',
                  isActive && 'bg-slate-50 ring-2 ring-slate-200 ring-offset-1'
                )}
              >
                {isCompleted ? <Check className="size-4" /> : index + 1}
              </button>
            );
          }

          return (
            <button
              key={index}
              onClick={() => onSelectQuestion(index)}
              className={cn(
                'flex w-full items-center justify-between rounded-md border px-3 py-2 text-sm transition-colors hover:bg-slate-50',
                isCompleted
                  ? 'border-emerald-500 bg-white'
                  : 'border-slate-100 bg-slate-50/50',
                isActive && 'ring-2 ring-blue-100 ring-offset-0 border-blue-200'
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'flex size-5 items-center justify-center rounded-full',
                    isCompleted
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-200 text-transparent'
                  )}
                >
                  <Check className="size-3" />
                </div>
                <span
                  className={cn(
                    isCompleted ? 'text-emerald-500 font-medium' : 'text-slate-400'
                  )}
                >
                  Question {index + 1}
                </span>
              </div>
              <ChevronRight
                className={cn(
                  'size-4',
                  isCompleted ? 'text-emerald-500' : 'text-slate-300'
                )}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
