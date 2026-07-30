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



  // Use the actual list of created question IDs returned by the backend.
  const createdCount = testResponse?.questions?.length ?? 0;

  // Sidebar: mark only the created question slots green; future slots stay disabled.
  const completedQuestions = Array.from({ length: createdCount }, (_, i) => i);

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] w-full flex-col space-y-5 overflow-x-hidden bg-slate-50/50 p-6">
      {/* Top Breadcrumb */}
      <div className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-[20px] py-4 shadow-xs">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span>{PUBLISH_TEST_MESSAGES.TITLE}</span>
        </div>
      </div>

      {/* Sidebar + Main Content */}
      <div className="flex w-full min-w-0 flex-1 items-start gap-5">
        <QuestionListSidebar
          totalQuestions={createdCount}
          activeQuestionIndex={-1}
          completedQuestions={completedQuestions}
          onSelectQuestion={() => {}}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Main publish content */}
        <div className="flex min-w-0 flex-1 flex-col space-y-5">
          <div className="flex flex-col space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center gap-[30px]">
              <h1 className="text-xl font-bold text-slate-900">
                {PUBLISH_TEST_MESSAGES.TEST_CREATED}
              </h1>
              {/* Dynamic badge: reflects actual created question count from backend */}
              <div className="inline-flex items-center gap-1.5 rounded-[8px] border border-emerald-500 bg-emerald-50/30 py-1 pr-[10px] pl-[10px] text-xs font-medium text-emerald-600">
                <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
                <span>
                  All {createdCount} Question{createdCount !== 1 ? 's' : ''} done
                </span>
              </div>
            </div>

            <PublishSettingsMain testId={testId || undefined} test={testResponse} />
          </div>
        </div>
      </div>
    </div>
  );
}
