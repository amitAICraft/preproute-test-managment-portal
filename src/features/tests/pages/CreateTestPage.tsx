import { CreateTestForm } from '../components/CreateTestForm';
import { QUESTION_BUILDER_MESSAGES } from '../constants/questionBuilder.constants';

export function CreateTestPage() {
  return (
    <div className="mx-auto max-w-4xl py-6">
      {/* Breadcrumb Header */}
      <div className="mb-8 flex items-center space-x-2 text-base text-slate-500">
        <span>{QUESTION_BUILDER_MESSAGES.BREADCRUMBS.TEST_CREATION}</span>
        <span className="px-2">/</span>
        <span>{QUESTION_BUILDER_MESSAGES.BREADCRUMBS.CREATE_TEST}</span>
        <span className="px-2">/</span>
        <span className="font-medium text-slate-800">{QUESTION_BUILDER_MESSAGES.BREADCRUMBS.CHAPTER_WISE}</span>
      </div>

      {/* Form Container */}
      <CreateTestForm />
    </div>
  );
}
