import { Plus, FileText } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageContainer } from '@/components/layout/PageContainer';
import { ContentContainer } from '@/components/layout/ContentContainer';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { DASHBOARD_MESSAGES } from '@/features/tests';
import { DashboardTable } from '../components/DashboardTable';
import { useDashboard } from '../hooks/useDashboard';

/**
 * DashboardPage — pure renderer.
 *
 * All business logic (navigation, API, delete signal) lives in `useDashboard`.
 * All UI strings come from `DASHBOARD_MESSAGES` constants.
 * All routes come from `ROUTES` constants (via the hook).
 */
export function DashboardPage() {
  const {
    tests,
    isLoading,
    isError,
    error,
    handleCreateNew,
    handleEdit,
    handleView,
    handleDelete,
  } = useDashboard();

  const errorMessage =
    error && typeof error === 'object' && 'data' in error
      ? ((error.data as { message?: string })?.message ?? DASHBOARD_MESSAGES.ERROR_FALLBACK)
      : DASHBOARD_MESSAGES.ERROR_FALLBACK;

  return (
    <PageContainer>
      <ContentContainer className="py-8">
        <PageHeader
          title={DASHBOARD_MESSAGES.PAGE_TITLE}
          description={DASHBOARD_MESSAGES.PAGE_DESCRIPTION}
          actions={
            <Button onClick={handleCreateNew} id="dashboard-create-btn">
              <Plus className="h-4 w-4" aria-hidden="true" />
              {DASHBOARD_MESSAGES.CREATE_BUTTON}
            </Button>
          }
        />

        {isLoading ? (
          <div
            className="flex justify-center items-center py-20"
            role="status"
            aria-label={DASHBOARD_MESSAGES.LOADING_LABEL}
          >
            <LoadingSpinner size={40} />
          </div>
        ) : isError ? (
          <ErrorState
            title={DASHBOARD_MESSAGES.ERROR_TITLE}
            message={errorMessage}
          />
        ) : tests.length > 0 ? (
          <DashboardTable
            tests={tests}
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
                variant="outline"
                className="mt-4"
                id="dashboard-empty-create-btn"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                {DASHBOARD_MESSAGES.CREATE_BUTTON}
              </Button>
            }
          />
        )}
      </ContentContainer>
    </PageContainer>
  );
}
