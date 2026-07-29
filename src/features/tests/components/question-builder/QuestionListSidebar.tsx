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
        'flex shrink-0 flex-col rounded-xl border border-slate-200 bg-white shadow-xs transition-all duration-300',
        isCollapsed ? 'w-16 items-center p-3' : 'w-[220px] p-4',
      )}
    >
      {/* Header */}
      <div
        className={cn(
          'mb-3 flex w-full items-center justify-between border-b border-slate-100 pb-3',
          isCollapsed && 'mb-2 justify-center border-none pb-0',
        )}
      >
        {!isCollapsed && (
          <h2 className="text-sm font-semibold whitespace-nowrap text-slate-800">
            {QUESTION_BUILDER_MESSAGES.TITLE}
          </h2>
        )}
        <button
          onClick={onToggleCollapse}
          className="flex size-7 shrink-0 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="size-4" />
          ) : (
            <span className="flex items-center">
              <ChevronLeft className="size-4" />
              <ChevronLeft className="-ml-2.5 size-4" />
            </span>
          )}
        </button>
      </div>

      {/* Total Questions sub-header */}
      {!isCollapsed && (
        <div className="pb-3 text-xs font-medium text-slate-500">
          {QUESTION_BUILDER_MESSAGES.TOTAL_QUESTIONS} . {totalQuestions}
        </div>
      )}

      {/* Question list */}
      <div className="custom-scrollbar max-h-[calc(100vh-16rem)] w-full flex-1 space-y-2 overflow-y-auto pr-0.5">
        {questions.map((index) => {
          const isCompleted = completedQuestions.includes(index);
          const isActive = index === activeQuestionIndex;
          const isDisabled = index > completedQuestions.length;

          if (isCollapsed) {
            return (
              <button
                key={index}
                onClick={() => onSelectQuestion(index)}
                disabled={isDisabled}
                className={cn(
                  'mx-auto flex size-8 items-center justify-center rounded-full border text-xs font-medium transition-all',
                  isCompleted
                    ? 'border-emerald-500 bg-emerald-50 font-semibold text-emerald-600'
                    : isActive
                      ? 'border-[#7489FF] bg-blue-50/50 font-semibold text-[#7489FF] ring-2 ring-[#7489FF]/30'
                      : isDisabled
                        ? 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed opacity-60'
                        : 'border-slate-200 text-slate-400 hover:border-slate-300 hover:bg-slate-50',
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
              disabled={isDisabled}
              className={cn(
                'flex w-full items-center justify-between rounded-full border px-3 py-2 text-xs font-medium transition-all',
                isCompleted
                  ? 'border-emerald-500 bg-emerald-50/20 text-emerald-700'
                  : isActive
                    ? 'border-[#7489FF] bg-blue-50/40 font-semibold text-[#7489FF] shadow-2xs'
                    : isDisabled
                      ? 'border-slate-100 bg-slate-50/50 text-slate-400 cursor-not-allowed opacity-60'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
              )}
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <div
                  className={cn(
                    'flex size-5 shrink-0 items-center justify-center rounded-full text-[11px]',
                    isCompleted
                      ? 'bg-emerald-500 text-white'
                      : isActive
                        ? 'border-2 border-[#7489FF] bg-white font-bold text-[#7489FF]'
                        : isDisabled
                          ? 'border border-slate-200 bg-slate-100 font-medium text-slate-300'
                          : 'border border-slate-300 bg-slate-50 font-medium text-slate-400',
                  )}
                >
                  {isCompleted ? <Check className="size-3" /> : index + 1}
                </div>
                <span className="truncate whitespace-nowrap">Question {index + 1}</span>
              </div>
              <ChevronRight
                className={cn(
                  'ml-1 size-3.5 shrink-0',
                  isCompleted ? 'text-emerald-500' : isActive ? 'text-[#7489FF]' : 'text-slate-300',
                )}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
