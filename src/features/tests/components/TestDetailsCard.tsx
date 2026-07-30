import { Edit3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { QUESTION_BUILDER_MESSAGES } from '../constants/questionBuilder.constants';
import type { Test, DifficultyLevel } from '../types/test.types';

/** Maps difficulty level - color palette + label */
const DIFFICULTY_CONFIG: Record<DifficultyLevel, { bg: string; text: string; label: string }> = {
  easy: { bg: '#2AB7A9', text: '#FEFEFF', label: 'Easy' },
  medium: { bg: '#E9B406', text: '#FEFEFF', label: 'Medium' },
  difficult: { bg: '#FF6B6B', text: '#FEFEFF', label: 'Difficult' },
};

interface TestDetailsCardProps {
  onEdit?: () => void;
  test?: Test;
}

/**
 * TestDetailsCard — Chapter summary card shown at the top of the Question Builder.
 * - "Chapter Wise" dark badge top to left
 */
export function TestDetailsCard({ onEdit, test }: TestDetailsCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Top row- badge left, edit button right */}
      <div className="mb-3 flex items-start justify-between">
        <Badge variant="dark" className="rounded-md px-3 font-normal capitalize">
          {test?.testType?.replace('-', ' ') || QUESTION_BUILDER_MESSAGES.CHAPTER_WISE}
        </Badge>
        {onEdit && (
          <button
            onClick={onEdit}
            className="text-[#7489FF] transition-colors hover:text-[#5B73E8]"
          >
            <Edit3 className="size-4" />
          </button>
        )}
      </div>

      {/* Chapter title row- chaptor-icon + title + difficulty badge */}
      <div className="mb-4 flex items-center gap-3">
        <img src="/chaptor-icon.svg" alt="" className="size-6 shrink-0" />
        <h3 className="text-base font-bold text-slate-900">{test?.title || 'Chapter 1'}</h3>
        {(() => {
          const rawLevel = test?.difficultyLevel || 'easy';
          const level = rawLevel.toLowerCase() as DifficultyLevel;
          const config = DIFFICULTY_CONFIG[level] || DIFFICULTY_CONFIG.easy;
          return (
            <span
              className="ml-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
              style={{ backgroundColor: config.bg, color: config.text }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.5" fill="none" />
                <path
                  d="M6 9l2 2 4-4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
              {config.label}
            </span>
          );
        })()}
      </div>

      {/* Info grid & Bottom-Right Stats container */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div className="grid grid-cols-[90px_1fr] gap-y-2 text-sm">
          <span className="text-slate-400">{QUESTION_BUILDER_MESSAGES.SUBJECT}</span>
          <span className="font-medium text-[#6B7280]">: {test?.subject || 'English'}</span>

          <span className="text-slate-400">{QUESTION_BUILDER_MESSAGES.TOPIC}</span>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400">:</span>
            {test?.topics && test.topics.length > 0 ? (
              <span className="inline-flex items-center rounded-md border border-[#E9B406] bg-transparent px-2.5 py-0.5 text-xs font-medium text-[#FFC82C]">
                {test.topics.join(', ')}
              </span>
            ) : (
              <>
                <span className="inline-flex items-center rounded-md border border-[#E9B406] bg-transparent px-2.5 py-0.5 text-xs font-medium text-[#FFC82C]">
                  Grammar
                </span>
                <span className="inline-flex items-center rounded-md border border-[#E9B406] bg-transparent px-2.5 py-0.5 text-xs font-medium text-[#FFC82C]">
                  Writing
                </span>
              </>
            )}
          </div>

          <span className="text-slate-400">{QUESTION_BUILDER_MESSAGES.SUB_TOPIC}</span>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400">:</span>
            {test?.subTopics && test.subTopics.length > 0 ? (
              <span className="inline-flex items-center rounded-md border border-[#E9B406] bg-transparent px-2.5 py-0.5 text-xs font-medium text-[#FFC82C]">
                {test.subTopics.join(', ')}
              </span>
            ) : (
              <span className="inline-flex items-center rounded-md border border-[#E9B406] bg-transparent px-2.5 py-0.5 text-xs font-medium text-[#FFC82C]">
                Application
              </span>
            )}
          </div>
        </div>

        {/* Bottom Right Stats Box with timer.svg, quiz.svg, leaderbord.svg */}
        <div className="flex shrink-0 items-center gap-3.5 self-end rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-500">
          <div className="flex items-center gap-1.5">
            <img src="/timer.svg" alt="" className="size-4" />
            <span>{test?.duration ?? 60} Min</span>
          </div>
          <div className="h-3.5 w-px bg-slate-200" />
          <div className="flex items-center gap-1.5">
            <img src="/quiz.svg" alt="" className="size-4" />
            <span>{test?.totalQuestions ?? 50} Q's</span>
          </div>
          <div className="h-3.5 w-px bg-slate-200" />
          <div className="flex items-center gap-1.5">
            <img src="/leaderboard.svg" alt="" className="size-4" />
            <span>{test?.totalMarks ?? 250} Marks</span>
          </div>
        </div>
      </div>
    </div>
  );
}
