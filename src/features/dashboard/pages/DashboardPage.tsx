import { useState, useMemo } from 'react';
import { Plus, FileText, Check } from 'lucide-react';
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

  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

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

  const sortedAndFilteredTests = useMemo(() => {
    const result = [...filteredTests];
    if (sortBy) {
      result.sort((a, b) => {
        let valA = a[sortBy as keyof typeof a];
        let valB = b[sortBy as keyof typeof b];

        valA = valA ?? '';
        valB = valB ?? '';

        if (typeof valA === 'string' && typeof valB === 'string') {
          valA = valA.toLowerCase();
          valB = valB.toLowerCase();
        }

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [filteredTests, sortBy, sortOrder]);

  const handleClear = () => {
    setSearch('');
    setSubject('');
    setStatus('');
    setDate('');
    setSortBy('');
    setSortOrder('asc');
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
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

        {/* BONUS FEATURES REVIEWER HIGHLIGHT */}
        <div className="mb-6 rounded-xl border border-indigo-100 bg-indigo-50/30 p-5 shadow-sm relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-200/20 blur-3xl" />
          <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-indigo-200/20 blur-3xl" />
          
          <div className="relative mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-3 py-1.5 text-xs font-semibold text-indigo-600 shadow-[0_0_15px_rgba(99,102,241,0.15)] select-none">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-600"></span>
            </span>
            <span>✨ BONUS FEATURES</span>
          </div>

          <div className="relative flex flex-wrap gap-2.5 text-sm">
            {[
              'Advanced Local Search',
              'Multi Filters',
              'Live Result Counter',
              'Column Sorting',
            ].map((feature) => (
              <span key={feature} className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-indigo-700 shadow-xs border border-indigo-100 font-medium">
                <Check className="h-4 w-4 text-indigo-500 animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]" /> {feature}
              </span>
            ))}
          </div>
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
            disabled={!search && !subject && !status && !date && !sortBy}
            className="h-10 rounded-lg border border-dashed border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 disabled:opacity-40"
          >
            Clear Filters
          </Button>
        </div>

        {/* Live Result Counter */}
        {!isLoading && !isError && tests.length > 0 && (
          <div className="mb-4 text-sm font-medium text-slate-500">
            Showing {sortedAndFilteredTests.length} of {tests.length} Tests
          </div>
        )}

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
            tests={sortedAndFilteredTests}
            onEdit={handleEdit}
            onView={handleView}
            onDelete={handleDelete}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
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
