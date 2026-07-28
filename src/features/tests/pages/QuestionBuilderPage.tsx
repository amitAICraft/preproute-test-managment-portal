import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { QuestionListSidebar } from '../components/question-builder/QuestionListSidebar';
import { QuestionEditorMain } from '../components/question-builder/QuestionEditorMain';
import { QUESTION_BUILDER_MESSAGES } from '../constants/questionBuilder.constants';

export function QuestionBuilderPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState(3); // 4th question (0-indexed)
  const completedQuestions = [0, 1, 2, 3];

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col -m-6 bg-white overflow-hidden">
      
      {/* Top Header */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 px-6">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span>Test Creation</span>
          <span>/</span>
          <span>Create Test</span>
          <span>/</span>
          <span className="text-slate-800 font-medium">Chapter Wise</span>
        </div>
        
        <Button className="bg-blue-500 hover:bg-blue-600 font-medium px-8">
          {QUESTION_BUILDER_MESSAGES.PUBLISH}
        </Button>
      </div>

      {/* Split Content Area */}
      <div className="flex flex-1 overflow-hidden">
        <QuestionListSidebar
          totalQuestions={50}
          activeQuestionIndex={activeQuestion}
          completedQuestions={completedQuestions}
          onSelectQuestion={setActiveQuestion}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        <QuestionEditorMain 
          activeQuestionIndex={activeQuestion}
          totalQuestions={50}
        />
      </div>

    </div>
  );
}
