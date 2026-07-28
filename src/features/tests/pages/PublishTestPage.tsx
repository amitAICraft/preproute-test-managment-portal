import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { QuestionListSidebar } from '../components/question-builder/QuestionListSidebar';
import { PublishSettingsMain } from '../components/publish/PublishSettingsMain';
import { PUBLISH_TEST_MESSAGES } from '../constants/publish.constants';

export function PublishTestPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  // On the publish page, typically all questions are done and the active question might just be the last one, or none.
  const totalQuestions = 50;
  const completedQuestions = Array.from({ length: 50 }, (_, i) => i);

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col -m-6 bg-white overflow-hidden">
      
      {/* Top Header - No Breadcrumbs here per Figma */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 px-6">
        <div className="text-sm text-slate-800 font-medium">
          {PUBLISH_TEST_MESSAGES.TITLE}
        </div>
      </div>

      {/* Split Content Area */}
      <div className="flex flex-1 overflow-hidden">
        <QuestionListSidebar
          totalQuestions={totalQuestions}
          activeQuestionIndex={-1} // Nothing selected
          completedQuestions={completedQuestions}
          onSelectQuestion={() => {}}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Sub header specifically for publish main area */}
          <div className="px-10 pt-10 pb-6 flex items-center gap-4 bg-slate-50/30">
            <h1 className="text-xl font-bold text-slate-800">{PUBLISH_TEST_MESSAGES.TEST_CREATED}</h1>
            <Badge variant="success" className="gap-1.5 rounded-full px-3 py-1 font-medium bg-emerald-50 border border-emerald-200">
              <CheckCircle2 className="size-3.5" />
              {PUBLISH_TEST_MESSAGES.ALL_QUESTIONS_DONE}
            </Badge>
          </div>
          
          <PublishSettingsMain />
        </div>
      </div>

    </div>
  );
}
