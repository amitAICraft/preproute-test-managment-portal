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
    /**
     * -m-6 cancels the AppLayout's p-6 on <main> so the QB can own its
     * full viewport height.  overflow-hidden prevents the double-scrollbar
     * that caused horizontal overflow.
     */
    <div className="flex h-[calc(100vh-4rem)] flex-col -m-6 bg-white overflow-hidden">
      
      {/* ── Breadcrumb / Publish row ── */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 px-6">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span>{QUESTION_BUILDER_MESSAGES.BREADCRUMBS.TEST_CREATION}</span>
          <span>/</span>
          <span>{QUESTION_BUILDER_MESSAGES.BREADCRUMBS.CREATE_TEST}</span>
          <span>/</span>
          <span className="font-medium text-slate-800">
            {QUESTION_BUILDER_MESSAGES.BREADCRUMBS.CHAPTER_WISE}
          </span>
        </div>
        
        <Button 
          className="bg-[#7489FF] hover:bg-[#5B73E8] font-medium px-8 h-10 rounded-lg"
          onClick={() => {
            if (testId) navigate(`/tests/create/publish?testId=${testId}`);
          }}
        >
          {QUESTION_BUILDER_MESSAGES.PUBLISH}
        </Button>
      </div>

      {/* ── Split content: Secondary Sidebar + Main Editor ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Secondary sidebar — sits immediately to the right of the primary sidebar */}
        <QuestionListSidebar
          totalQuestions={totalQuestions}
          activeQuestionIndex={activeQuestion}
          completedQuestions={completedQuestions}
          onSelectQuestion={setActiveQuestion}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        {/* Main editor — takes all remaining width, no fixed max-w */}
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
