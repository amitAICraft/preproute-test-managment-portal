import { CreateTestForm } from '../components/CreateTestForm';

export function CreateTestPage() {
  return (
    <div className="mx-auto max-w-4xl py-6">
      {/* Breadcrumb Header */}
      <div className="mb-8 flex items-center space-x-2 text-base text-slate-500">
        <span>Test Creation</span>
        <span className="px-2">/</span>
        <span>Create Test</span>
        <span className="px-2">/</span>
        <span className="font-medium text-slate-800">Chapter Wise</span>
      </div>

      {/* Form Container */}
      <CreateTestForm />
    </div>
  );
}
