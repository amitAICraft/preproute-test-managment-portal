import { useState, useMemo } from 'react';
import { Plus, FileText } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageContainer } from '@/components/layout/PageContainer';
import { ContentContainer } from '@/components/layout/ContentContainer';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { DASHBOARD_MESSAGES } from '@/features/tests';
import { useTest } from '@/features/tests';
import { EditTestDialog } from '@/features/tests/components/edit-test/EditTestDialog';
import { DashboardTable } from '../components/DashboardTable';
import { useDashboard } from '../hooks/useDashboard';
import { cn } from '@/lib/utils';

export function DashboardPage() {
  const {
    tests,
    isLoading,
    isError,
    error,
    editTestId,
    closeEditDialog,
    handleCreateNew,
    handleEdit,
    handleView,
    handleDelete,
  } = useDashboard();

  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('');
  const [status, setStatus] = useState('');
  const [date, setDate] = useState('');

  /** Fetch the full test object for the dialog only when editTestId is set. */
  const { test: testToEdit } = useTest(editTestId ?? undefined);

  const errorMessage =
    error && typeof error === 'object' && 'data' in error
      ? ((error.data as { message?: string })?.message ?? DASHBOARD_MESSAGES.ERROR_FALLBACK)
      : DASHBOARD_MESSAGES.ERROR_FALLBACK;

  // Extract unique subjects and statuses dynamically from tests list
  const subjects = useMemo(() => {
    const list = tests.map((t) => t.subject).filter(Boolean);
    return Array.from(new Set(list)).sort();
  }, [tests]);

  const statuses = useMemo(() => {
    const list = tests.map((t) => t.status).filter(Boolean);
    return Array.from(new Set(list)).sort();
  }, [tests]);

  // Combined filters logic using useMemo for performance
  const filteredTests = useMemo(() => {
    return tests.filter((test) => {
      if (search) {
        const query = search.toLowerCase();
        const matchesName = test.title.toLowerCase().includes(query);
        if (!matchesName) return false;
      }
      if (subject) {
        if (test.subject !== subject) return false;
      }
      if (status) {
        if (test.status !== status) return false;
      }
      if (date) {
        const testDateStr = test.createdAt?.substring(0, 10);
        if (testDateStr !== date) return false;
      }
      return true;
    });
  }, [tests, search, subject, status, date]);

  const handleClear = () => {
    setSearch('');
    setSubject('');
    setStatus('');
    setDate('');
  };

  return (
    <PageContainer>
      <ContentContainer className="py-8">
        <PageHeader
          title={DASHBOARD_MESSAGES.PAGE_TITLE}
          description={DASHBOARD_MESSAGES.PAGE_DESCRIPTION}
          actions={
            <Button
              onClick={handleCreateNew}
              id="dashboard-create-btn"
              style={{ backgroundColor: '#7489FF', color: '#FFFFFF' }}
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              {DASHBOARD_MESSAGES.CREATE_BUTTON}
            </Button>
          }
        />

        {/* Animated Badge for Bonus Feature */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-150 bg-indigo-50/50 px-3 py-1 text-xs font-semibold text-[#7489FF] shadow-[0_0_12px_rgba(116,137,255,0.15)] select-none">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7489FF] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#7489FF]"></span>
          </span>
          <span>✨ BONUS FEATURE: Advanced Local Search & Filters</span>
        </div>

        {/* Filters Controls Panel */}
        <div className="mb-6 grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-xs md:grid-cols-5 items-end">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Search Test Name</label>
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 rounded-lg border border-slate-200 px-3 text-sm focus:border-[#7489FF] focus:outline-none focus:ring-1 focus:ring-[#7489FF] bg-white text-slate-800"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Subject</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="h-10 rounded-lg border border-slate-200 px-3 text-sm focus:border-[#7489FF] focus:outline-none focus:ring-1 focus:ring-[#7489FF] bg-white text-slate-800"
            >
              <option value="">All Subjects</option>
              {subjects.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-10 rounded-lg border border-slate-200 px-3 text-sm focus:border-[#7489FF] focus:outline-none focus:ring-1 focus:ring-[#7489FF] bg-white text-slate-800"
            >
              <option value="">All Statuses</option>
              {statuses.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Created Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-10 rounded-lg border border-slate-200 px-3 text-sm focus:border-[#7489FF] focus:outline-none focus:ring-1 focus:ring-[#7489FF] bg-white text-slate-800"
            />
          </div>
          <Button
            type="button"
            variant="ghost"
            onClick={handleClear}
            disabled={!search && !subject && !status && !date}
            className="h-10 rounded-lg border border-dashed border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 disabled:opacity-40"
          >
            Clear Filters
          </Button>
        </div>

        {isLoading ? (
          <div
            className="flex items-center justify-center py-20"
            role="status"
            aria-label={DASHBOARD_MESSAGES.LOADING_LABEL}
          >
            <LoadingSpinner size={40} />
          </div>
        ) : isError ? (
          <ErrorState title={DASHBOARD_MESSAGES.ERROR_TITLE} message={errorMessage} />
        ) : tests.length > 0 ? (
          <DashboardTable
            tests={filteredTests}
            onEdit={handleEdit}
            onView={handleView}
            onDelete={handleDelete}
          />
        ) : (
          <EmptyState
            icon={<FileText className="h-12 w-12" aria-hidden="true" />}
            title={DASHBOARD_MESSAGES.EMPTY_TITLE}
            description={DASHBOARD_MESSAGES.EMPTY_DESCRIPTION}
            action={
              <Button
                onClick={handleCreateNew}
                className="mt-4"
                id="dashboard-empty-create-btn"
                style={{ backgroundColor: '#7489FF', color: '#FFFFFF' }}
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                {DASHBOARD_MESSAGES.CREATE_BUTTON}
              </Button>
            }
          />
        )}
      </ContentContainer>

      {/* Edit Test Dialog — rendered at page level so it overlays the table */}
      <EditTestDialog
        open={editTestId !== null}
        onOpenChange={(open) => {
          if (!open) closeEditDialog();
        }}
        existingTest={testToEdit}
      />
    </PageContainer>
  );
}
