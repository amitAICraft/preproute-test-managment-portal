import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { CheckCircle2 } from 'lucide-react';
import { QuestionListSidebar } from '../components/question-builder/QuestionListSidebar';
import { PublishSettingsMain } from '../components/publish/PublishSettingsMain';
import { PUBLISH_TEST_MESSAGES } from '../constants/publish.constants';
import { useGetTestByIdQuery } from '@/features/tests/api/testApi';

export function PublishTestPage() {
  const [searchParams] = useSearchParams();
  const testId = searchParams.get('testId');
  const { data: testResponse } = useGetTestByIdQuery(testId || '', {
    skip: !testId,
  });

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const totalQuestions = testResponse?.totalQuestions || 50;
  const completedQuestions = Array.from({ length: totalQuestions }, (_, i) => i);

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] w-full flex-col space-y-5 overflow-x-hidden bg-slate-50/50 p-6">
      {/* Fix 1: Top Breadcrumb Container with px-[20px] left/right padding and proper top/bottom spacing */}
      <div className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-[20px] py-4 shadow-xs">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span>{PUBLISH_TEST_MESSAGES.TITLE}</span>
        </div>
      </div>

      {/* Fix 2 & Fix 3: Secondary Sidebar + Main Publish Area in responsive flex layout */}
      <div className="flex w-full min-w-0 flex-1 items-start gap-5">
        {/* Secondary Question Creation Sidebar (no clipping, no negative margins) */}
        <QuestionListSidebar
          totalQuestions={totalQuestions}
          activeQuestionIndex={-1}
          completedQuestions={completedQuestions}
          onSelectQuestion={() => {}}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Main Publish Content occupying remaining width */}
        <div className="flex min-w-0 flex-1 flex-col space-y-5">
          {/* Header Card with Test Created + Success Badge */}
          <div className="flex flex-col space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center gap-[30px]">
              <h1 className="text-xl font-bold text-slate-900">
                {PUBLISH_TEST_MESSAGES.TEST_CREATED}
              </h1>
              {/* Fix 7: Success Badge matching Figma specs: pl-[10px] pr-[10px] gap-[30px] rounded-[8px] */}
              <div className="inline-flex items-center gap-1.5 rounded-[8px] border border-emerald-500 bg-emerald-50/30 py-1 pr-[10px] pl-[10px] text-xs font-medium text-emerald-600">
                <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
                <span>{PUBLISH_TEST_MESSAGES.ALL_QUESTIONS_DONE}</span>
              </div>
            </div>

            <PublishSettingsMain testId={testId || undefined} test={testResponse} />
          </div>
        </div>
      </div>
    </div>
  );
}
