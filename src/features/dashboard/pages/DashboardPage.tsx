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

/**
 * DashboardPage — pure renderer.
 *
 * All business logic (navigation, dialog state, delete signal) lives in `useDashboard`.
 * All UI strings come from `DASHBOARD_MESSAGES` constants.
 * All routes come from `ROUTES` constants (via the hook).
 *
 * Edit action: opens EditTestDialog (modal) — as per Figma 04-edit-test-details-modal.png.
 * View action: navigates to the Question Builder with the testId search param.
 * Delete action: disabled — no DELETE endpoint exists in API_DOCUMENTATION.pdf.
 */
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

  /** Fetch the full test object for the dialog only when editTestId is set. */
  const { test: testToEdit } = useTest(editTestId ?? undefined);

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
