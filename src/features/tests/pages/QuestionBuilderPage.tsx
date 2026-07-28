import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { QuestionListSidebar } from '../components/question-builder/QuestionListSidebar';
import { QuestionEditorMain } from '../components/question-builder/QuestionEditorMain';
import { QUESTION_BUILDER_MESSAGES } from '../constants/questionBuilder.constants';
import { useGetTestByIdQuery } from '@/features/tests/api/testApi';

export function QuestionBuilderPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const testId = searchParams.get('testId');
  const { data: testResponse } = useGetTestByIdQuery(testId || '', {
    skip: !testId,
  });
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState(0); 
  const [completedQuestions, setCompletedQuestions] = useState<number[]>([]);
  
  const handleSaveSuccess = () => {
    setCompletedQuestions((prev) => Array.from(new Set([...prev, activeQuestion])));
    setActiveQuestion((prev) => Math.min(prev + 1, totalQuestions - 1));
  };

  const totalQuestions = testResponse?.totalQuestions || 50;

  return (
    <div className="w-full flex flex-col space-y-5 bg-slate-50/50 p-6 min-h-[calc(100vh-3.5rem)] overflow-x-hidden">
      
      {/* ── Breadcrumb / Publish Container ── */}
      {/* Wrapped in its own container with border, border-radius, 20px left/right padding */}
      <div className="w-full rounded-xl border border-slate-200 bg-white px-[20px] py-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span>{QUESTION_BUILDER_MESSAGES.BREADCRUMBS.TEST_CREATION}</span>
          <span className="text-slate-300">/</span>
          <span>{QUESTION_BUILDER_MESSAGES.BREADCRUMBS.CREATE_TEST}</span>
          <span className="text-slate-300">/</span>
          <span className="font-medium text-slate-800">
            {QUESTION_BUILDER_MESSAGES.BREADCRUMBS.CHAPTER_WISE}
          </span>
        </div>
        
        <Button 
          className="bg-[#7489FF] hover:bg-[#5B73E8] font-medium px-8 h-10 rounded-lg shadow-xs"
          onClick={() => {
            if (testId) navigate(`/tests/create/publish?testId=${testId}`);
          }}
        >
          {QUESTION_BUILDER_MESSAGES.PUBLISH}
        </Button>
      </div>

      {/* ── Split Content Area: Secondary Sidebar + Question Editor ── */}
      <div className="flex w-full items-start gap-5 min-w-0 flex-1">
        {/* Secondary sidebar — standalone card sitting beside main editor */}
        <QuestionListSidebar
          totalQuestions={totalQuestions}
          activeQuestionIndex={activeQuestion}
          completedQuestions={completedQuestions}
          onSelectQuestion={setActiveQuestion}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        {/* Main editor — takes remaining space */}
        <QuestionEditorMain 
          activeQuestionIndex={activeQuestion}
          totalQuestions={totalQuestions}
          testId={testId || undefined}
          test={testResponse}
          onSaveSuccess={handleSaveSuccess}
        />
      </div>

    </div>
  );
}
