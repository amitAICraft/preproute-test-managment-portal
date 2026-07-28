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
        'flex flex-col rounded-xl border border-slate-200 bg-white shadow-xs shrink-0 transition-all duration-300',
        isCollapsed ? 'w-16 p-3 items-center' : 'w-[220px] p-4'
      )}
    >
      {/* Header */}
      <div className={cn(
        "flex items-center justify-between border-b border-slate-100 pb-3 mb-3 w-full",
        isCollapsed && "justify-center border-none pb-0 mb-2"
      )}>
        {!isCollapsed && (
          <h2 className="text-sm font-semibold text-slate-800 whitespace-nowrap">
            {QUESTION_BUILDER_MESSAGES.TITLE}
          </h2>
        )}
        <button
          onClick={onToggleCollapse}
          className="flex size-7 shrink-0 items-center justify-center rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
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
        <div className="pb-3 text-xs text-slate-500 font-medium">
          {QUESTION_BUILDER_MESSAGES.TOTAL_QUESTIONS} . {totalQuestions}
        </div>
      )}

      {/* Question list */}
      <div className="flex-1 overflow-y-auto space-y-2 w-full custom-scrollbar pr-0.5 max-h-[calc(100vh-16rem)]">
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
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-600 font-semibold'
                    : isActive
                    ? 'border-[#7489FF] bg-blue-50/50 text-[#7489FF] font-semibold ring-2 ring-[#7489FF]/30'
                    : 'border-slate-200 text-slate-400 hover:border-slate-300 hover:bg-slate-50'
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
                'flex w-full items-center justify-between rounded-full border px-3 py-2 text-xs font-medium transition-all',
                isCompleted
                  ? 'border-emerald-500 bg-emerald-50/20 text-emerald-700'
                  : isActive
                  ? 'border-[#7489FF] bg-blue-50/40 text-[#7489FF] font-semibold shadow-2xs'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={cn(
                    'flex size-5 shrink-0 items-center justify-center rounded-full text-[11px]',
                    isCompleted
                      ? 'bg-emerald-500 text-white'
                      : isActive
                      ? 'border-2 border-[#7489FF] text-[#7489FF] bg-white font-bold'
                      : 'border border-slate-300 text-slate-400 bg-slate-50 font-medium'
                  )}
                >
                  {isCompleted ? <Check className="size-3" /> : index + 1}
                </div>
                <span className="truncate whitespace-nowrap">
                  Question {index + 1}
                </span>
              </div>
              <ChevronRight
                className={cn(
                  'size-3.5 shrink-0 ml-1',
                  isCompleted
                    ? 'text-emerald-500'
                    : isActive
                    ? 'text-[#7489FF]'
                    : 'text-slate-300'
                )}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
