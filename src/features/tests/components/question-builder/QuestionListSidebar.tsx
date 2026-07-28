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
  const questions = Array.from({ length: totalQuestions }, (_, i) => i);

  return (
    <div
      className={cn(
        'flex h-full flex-col border-r border-slate-200 bg-white shrink-0 transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-[220px]'
      )}
    >
      {/* Header */}
      <div className="flex h-14 items-center justify-between border-b border-slate-200 px-4">
        {!isCollapsed && (
          <h2 className="text-sm font-semibold text-slate-800 whitespace-nowrap">
            {QUESTION_BUILDER_MESSAGES.TITLE}
          </h2>
        )}
        <button
          onClick={onToggleCollapse}
          className={cn(
            'flex size-7 shrink-0 items-center justify-center rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors',
            isCollapsed && 'mx-auto'
          )}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="size-4" />
          ) : (
            <span className="flex items-center">
              <ChevronLeft className="size-4" />
              <ChevronLeft className="size-4 -ml-2.5" />
            </span>
          )}
        </button>
      </div>

      {/* Total Questions sub-header */}
      {!isCollapsed && (
        <div className="px-4 py-3 text-xs text-slate-500 font-medium">
          {QUESTION_BUILDER_MESSAGES.TOTAL_QUESTIONS} . {totalQuestions}
        </div>
      )}

      {/* Question list */}
      <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-2 custom-scrollbar">
        {questions.map((index) => {
          const isCompleted = completedQuestions.includes(index);
          const isActive = index === activeQuestionIndex;

          if (isCollapsed) {
            return (
              <button
                key={index}
                onClick={() => onSelectQuestion(index)}
                className={cn(
                  'mx-auto flex size-8 items-center justify-center rounded-full border text-xs font-medium transition-all',
                  isCompleted
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-600'
                    : 'border-slate-200 text-slate-400 hover:border-slate-300 hover:bg-slate-50',
                  isActive && 'ring-2 ring-emerald-400 border-emerald-500 bg-white font-semibold'
                )}
                title={`Question ${index + 1}`}
              >
                {isCompleted ? <Check className="size-4 text-emerald-600" /> : index + 1}
              </button>
            );
          }

          return (
            <button
              key={index}
              onClick={() => onSelectQuestion(index)}
              className={cn(
                'flex w-full items-center justify-between rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                isCompleted
                  ? 'border-emerald-500 bg-white text-slate-700'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
                isActive && 'border-emerald-500 bg-emerald-50/40 text-emerald-700 font-semibold shadow-xs'
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={cn(
                    'flex size-5 shrink-0 items-center justify-center rounded-full',
                    isCompleted
                      ? 'bg-emerald-500 text-white'
                      : 'border border-emerald-500 text-emerald-500'
                  )}
                >
                  <Check className="size-3" />
                </div>
                <span className="truncate whitespace-nowrap">
                  Question {index + 1}
                </span>
              </div>
              <ChevronRight
                className={cn(
                  'size-3.5 shrink-0 ml-1',
                  isCompleted || isActive ? 'text-emerald-500' : 'text-slate-300'
                )}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
