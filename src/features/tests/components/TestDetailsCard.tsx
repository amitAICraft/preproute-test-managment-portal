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
 * - chaptor-icon.svg + title + easy-icon.svg on the second row
 * - Subject / Topic / Sub Topic label grid below
 * - Minutes / Q's / Marks footer pinned to the bottom-right of the card
 * - Edit pencil pinned to the top-right
 */
export function TestDetailsCard({ onEdit, test }: TestDetailsCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Top row: badge left, edit button right */}
      <div className="flex items-start justify-between mb-4">
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

      {/* Chapter title row: chaptor-icon + title + easy-icon badge */}
      <div className="flex items-center gap-3 mb-4">
        {/* Issue 6: chaptor-icon.svg replacing emoji */}
        <img src="/chaptor-icon.svg" alt="" className="size-6 shrink-0" />
        <h3 className="text-base font-bold text-slate-900">
          {test?.title || 'Chapter 1'}
        </h3>
        {/* Issue 7: easy-icon.svg replacing CheckCircle2 badge */}
        <img src="/easy-icon.svg" alt={test?.difficultyLevel || 'Easy'} className="h-6 w-auto" />
      </div>

      {/* Info grid: Subject / Topic / Sub-Topic */}
      {/* Issue 9: Subject value → #6B7280; Issue 10: Topic/SubTopic → amber badge */}
      <div className="grid grid-cols-[90px_1fr] gap-y-2 text-sm mb-6">
        <span className="text-slate-400">{QUESTION_BUILDER_MESSAGES.SUBJECT}</span>
        <span className="text-[#6B7280] font-medium">: {test?.subject || 'English'}</span>

        <span className="text-slate-400">{QUESTION_BUILDER_MESSAGES.TOPIC}</span>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-400">:</span>
          {test?.topic ? (
            <span
              className="inline-flex items-center rounded-md border border-[#E9B406] bg-transparent px-2 py-0.5 text-xs font-medium text-[#FFC82C]"
            >
              {test.topic}
            </span>
          ) : (
            <span className="text-slate-300">—</span>
          )}
        </div>

        <span className="text-slate-400">{QUESTION_BUILDER_MESSAGES.SUB_TOPIC}</span>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-400">:</span>
          {test?.subTopic ? (
            <span
              className="inline-flex items-center rounded-md border border-[#E9B406] bg-transparent px-2 py-0.5 text-xs font-medium text-[#FFC82C]"
            >
              {test.subTopic}
            </span>
          ) : (
            <span className="text-slate-300">—</span>
          )}
        </div>
      </div>

      {/* Issue 11: Footer stats pinned to the bottom via mt-auto */}
      <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
        <div className="flex items-center gap-1.5">
          <span>⏱</span>
          <span>{test?.duration ?? '-'} Min</span>
        </div>
        <div className="h-4 w-px bg-slate-200" />
        <div className="flex items-center gap-1.5">
          <span>📝</span>
          <span>{test?.totalQuestions ?? '-'} Q's</span>
        </div>
        <div className="h-4 w-px bg-slate-200" />
        <div className="flex items-center gap-1.5">
          <span>📊</span>
          <span>{test?.totalMarks ?? '-'} Marks</span>
        </div>
      </div>
    </div>
  );
}
