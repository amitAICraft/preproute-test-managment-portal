import { useNavigate } from 'react-router';
import { Plus, FileText } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageContainer } from '@/components/layout/PageContainer';
import { ContentContainer } from '@/components/layout/ContentContainer';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { DashboardTable } from '../components/DashboardTable';
import { useGetTestsQuery } from '@/features/tests/api/testApi';

export function DashboardPage() {
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useGetTestsQuery();

  const handleCreateNew = () => {
    navigate('/tests/create');
  };

  const handleEdit = (id: string) => {
    // Navigate to edit/view page if it existed, or handle it as needed.
    // For now, based on requirements, wire the action up.
    // The test specifies no hardcoded routes, but editing might go to QuestionBuilder? 
    // Wait, the assignment requires to provide actions "Edit", "View", "Delete". 
    // They don't necessarily need to be fully wired up to pages that don't exist yet 
    // (the prompt says: "Stop after Dashboard is fully complete. Do NOT proceed to Preview or any other page.")
    // But they should trigger some console.log or sonner toast for now if the page is missing.
    // However, we do have /tests/create/questions which is the Question Builder. 
    // I'll just navigate to a placeholder or log for edit/view/delete unless specified.
    console.log('Edit test:', id);
  };

  const handleView = (id: string) => {
    console.log('View test:', id);
  };

  const handleDelete = (id: string) => {
    console.log('Delete test:', id);
  };

  return (
    <PageContainer>
      <ContentContainer className="py-8">
        <PageHeader
          title="Dashboard"
          description="Manage and track all your tests."
          actions={
            <Button onClick={handleCreateNew}>
              <Plus className="mr-2 h-4 w-4" />
              Create New Test
            </Button>
          }
        />

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : isError ? (
          <ErrorState
            title="Failed to load tests"
            message={
              error && typeof error === 'object' && 'data' in error
                ? (error.data as any)?.message || 'An unexpected error occurred.'
                : 'An unexpected error occurred while fetching your tests.'
            }
          />
        ) : data?.data && data.data.length > 0 ? (
          <DashboardTable
            tests={data.data}
            onEdit={handleEdit}
            onView={handleView}
            onDelete={handleDelete}
          />
        ) : (
          <EmptyState
            icon={<FileText className="h-12 w-12" />}
            title="No tests found"
            description="You haven't created any tests yet. Click the button above to get started."
            action={
              <Button onClick={handleCreateNew} variant="outline" className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Create New Test
              </Button>
            }
          />
        )}
      </ContentContainer>
    </PageContainer>
  );
}
