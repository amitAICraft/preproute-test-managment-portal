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
    <div className="flex h-[calc(100vh-3.5rem)] flex-col -m-6 bg-white overflow-hidden">
      
      {/* Top Header */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 px-6">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span>{QUESTION_BUILDER_MESSAGES.BREADCRUMBS.TEST_CREATION}</span>
          <span>/</span>
          <span>{QUESTION_BUILDER_MESSAGES.BREADCRUMBS.CREATE_TEST}</span>
          <span>/</span>
          <span className="text-slate-800 font-medium">{QUESTION_BUILDER_MESSAGES.BREADCRUMBS.CHAPTER_WISE}</span>
        </div>
        
        <Button 
          className="bg-blue-500 hover:bg-blue-600 font-medium px-8"
          onClick={() => {
            if (testId) navigate(`/tests/create/publish?testId=${testId}`);
          }}
        >
          {QUESTION_BUILDER_MESSAGES.PUBLISH}
        </Button>
      </div>

      {/* Split Content Area */}
      <div className="flex flex-1 overflow-hidden">
        <QuestionListSidebar
          totalQuestions={totalQuestions}
          activeQuestionIndex={activeQuestion}
          completedQuestions={completedQuestions}
          onSelectQuestion={setActiveQuestion}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
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
