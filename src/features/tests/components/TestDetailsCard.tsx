import { Edit3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { QUESTION_BUILDER_MESSAGES } from '../constants/questionBuilder.constants';
import type { Test } from '../types/test.types';

interface TestDetailsCardProps {
  onEdit?: () => void;
  test?: Test;
}

/**
 * TestDetailsCard — Chapter summary card shown at the top of the Question Builder.
 *
 * Layout matches 03-question-builder-page.png exactly:
 * - "Chapter Wise" dark badge top-left
 * - chaptor-icon.svg + title + easy-icon.svg (moved slightly to the right) on the title row
 * - Subject / Topic / Sub Topic label grid on the left
 * - ⏱ Minutes / 📝 Questions / 📊 Marks in a rounded pill at bottom-right inside the card
 * - Edit pencil top-right
 */
export function TestDetailsCard({ onEdit, test }: TestDetailsCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Top row: badge left, edit button right */}
      <div className="flex items-start justify-between mb-3">
        <Badge variant="dark" className="rounded-md px-3 font-normal capitalize">
          {test?.testType?.replace('-', ' ') || QUESTION_BUILDER_MESSAGES.CHAPTER_WISE}
        </Badge>
        {onEdit && (
          <button
            onClick={onEdit}
            className="text-[#7489FF] hover:text-[#5B73E8] transition-colors"
          >
            <Edit3 className="size-4" />
          </button>
        )}
      </div>

      {/* Chapter title row: chaptor-icon + title + easy-icon badge (moved right) */}
      <div className="flex items-center gap-3 mb-4">
        <img src="/chaptor-icon.svg" alt="" className="size-6 shrink-0" />
        <h3 className="text-base font-bold text-slate-900">
          {test?.title || 'Chapter 1'}
        </h3>
        <img src="/easy-icon.svg" alt={test?.difficultyLevel || 'Easy'} className="h-6 w-auto ml-2" />
      </div>

      {/* Info grid & Bottom-Right Stats container */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        {/* Info grid: Subject / Topic / Sub-Topic */}
        <div className="grid grid-cols-[90px_1fr] gap-y-2 text-sm">
          <span className="text-slate-400">{QUESTION_BUILDER_MESSAGES.SUBJECT}</span>
          <span className="text-[#6B7280] font-medium">: {test?.subject || 'English'}</span>

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
        <div className="flex items-center gap-3.5 rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs text-slate-500 font-medium shrink-0 self-end">
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
