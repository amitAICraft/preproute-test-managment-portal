import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { QuestionListSidebar } from '../components/question-builder/QuestionListSidebar';
import { QuestionEditorMain } from '../components/question-builder/QuestionEditorMain';
import { QUESTION_BUILDER_MESSAGES } from '../constants/questionBuilder.constants';
import { useGetTestByIdQuery } from '@/features/tests/api/testApi';
import { useFetchBulkQuestionsQuery } from '@/services/questionApi';

export function QuestionBuilderPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const testId = searchParams.get('testId');
  const { data: testResponse } = useGetTestByIdQuery(testId || '', {
    skip: !testId,
  });

  const questionIds = testResponse?.questions || [];
  const { data: questions = [] } = useFetchBulkQuestionsQuery(
    { question_ids: questionIds },
    { skip: questionIds.length === 0 }
  );

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState(0);

  const [completedQuestions, setCompletedQuestions] = useState<number[]>([]);

  // Sync completed questions when data is loaded
  useEffect(() => {
    if (questions.length > 0) {
      setCompletedQuestions((prev) => {
        const loadedIndices = questions.map((_, i) => i);
        return Array.from(new Set([...prev, ...loadedIndices]));
      });
    }
  }, [questions]);

  // Local state to store draft changes for each question index
  const [draftQuestions, setDraftQuestions] = useState<Record<number, any>>({});

  const handleSaveSuccess = () => {
    setDraftQuestions((prev) => {
      const next = { ...prev };
      delete next[activeQuestion];
      return next;
    });
    setCompletedQuestions((prev) => Array.from(new Set([...prev, activeQuestion])));
    setActiveQuestion((prev) => Math.min(prev + 1, totalQuestions - 1));
  };

  const totalQuestions = testResponse?.totalQuestions || 50;

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] w-full flex-col space-y-5 overflow-x-hidden bg-slate-50/50 p-6">
      {/* ── Breadcrumb / Publish Container ── */}
      {/* Wrapped in its own container with border, border-radius, 20px left/right padding */}
      <div className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-[20px] py-4 shadow-xs">
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
          className="h-10 rounded-lg bg-[#7489FF] px-8 font-medium shadow-xs hover:bg-[#5B73E8]"
          onClick={() => {
            if (testId) navigate(`/tests/create/publish?testId=${testId}`);
          }}
        >
          {QUESTION_BUILDER_MESSAGES.PUBLISH}
        </Button>
      </div>

      {/* ── Split Content Area: Secondary Sidebar + Question Editor ── */}
      <div className="flex w-full min-w-0 flex-1 items-start gap-5">
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
          questions={questions}
          draftQuestions={draftQuestions}
          setDraftQuestions={setDraftQuestions}
          onSaveSuccess={handleSaveSuccess}
        />
      </div>
    </div>
  );
}
