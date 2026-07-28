import { CheckCircle2, Edit3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { QUESTION_BUILDER_MESSAGES } from '../constants/questionBuilder.constants';
import type { Test } from '../types/test.types';

interface TestDetailsCardProps {
  onEdit?: () => void;
  test?: Test;
}

export function TestDetailsCard({ onEdit, test }: TestDetailsCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="space-y-4">
          <Badge variant="dark" className="rounded-md px-3 font-normal capitalize">
            {test?.testType?.replace('-', ' ') || QUESTION_BUILDER_MESSAGES.CHAPTER_WISE}
          </Badge>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center rounded-lg bg-orange-100 p-1.5">
              <span className="text-lg">📚</span>
            </div>
            <h3 className="text-lg font-bold">{test?.title || '-'}</h3>
            <Badge variant="success" className="gap-1 rounded-md font-medium capitalize">
              <CheckCircle2 className="size-3" />
              {test?.difficultyLevel || QUESTION_BUILDER_MESSAGES.EASY}
            </Badge>
          </div>

          <div className="grid grid-cols-[100px_1fr] gap-y-2 text-sm">
            <span className="text-slate-500">{QUESTION_BUILDER_MESSAGES.SUBJECT}</span>
            <span className="font-medium">: {test?.subject || '-'}</span>

            <span className="text-slate-500">{QUESTION_BUILDER_MESSAGES.TOPIC}</span>
            <div className="flex items-center gap-2">
              <span className="font-medium">:</span>
              {test?.topic ? (
                <Badge variant="outlineWarning" className="font-normal rounded-md">{test.topic}</Badge>
              ) : '-'}
            </div>

            <span className="text-slate-500">{QUESTION_BUILDER_MESSAGES.SUB_TOPIC}</span>
            <div className="flex items-center gap-2">
              <span className="font-medium">:</span>
              {test?.subTopic ? (
                <Badge variant="outlineWarning" className="font-normal rounded-md">{test.subTopic}</Badge>
              ) : '-'}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end justify-between h-full space-y-8">
          {onEdit ? (
            <button 
              onClick={onEdit}
              className="text-blue-500 hover:text-blue-600 transition-colors"
            >
              <Edit3 className="size-4" />
            </button>
          ) : (
            <div className="size-4" /> // Spacer to keep layout aligned
          )}
          
          <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
            <div className="flex items-center gap-1">
              <span>⏱</span> {test?.duration || '-'} Min
            </div>
            <div className="h-4 w-px bg-slate-200" />
            <div className="flex items-center gap-1">
              <span>📝</span> {test?.totalQuestions || '-'} Q's
            </div>
            <div className="h-4 w-px bg-slate-200" />
            <div className="flex items-center gap-1">
              <span>📊</span> {test?.totalMarks || '-'} Marks
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
