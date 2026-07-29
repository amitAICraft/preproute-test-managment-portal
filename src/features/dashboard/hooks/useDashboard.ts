import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTests } from '@/features/tests';
import { ROUTES } from '@/constants/routes';

/**
 * useDashboard — encapsulates all business logic for the Dashboard page.
 *
 * Edit opens the EditTestDialog (modal) — matching Figma 04-edit-test-details-modal.png.
 * View navigates to the Question Builder so the user can review questions.
 * Delete is intentionally omitted — no DELETE endpoint exists in the API.
 */
export function useDashboard() {
  const navigate = useNavigate();
  const { tests, isLoading, isFetching, isError, error } = useTests();

  /** ID of the test currently being edited in the dialog. null = dialog closed. */
  const [editTestId, setEditTestId] = useState<string | null>(null);

  const handleCreateNew = () => {
    navigate(ROUTES.TESTS.CREATE);
  };

  /**
   * Edit — opens the EditTestDialog modal with the selected test pre-loaded.
   * Matches Figma: 04-edit-test-details-modal.png shows a modal, not a page nav.
   */
  const handleEdit = (id: string) => {
    setEditTestId(id);
  };

  /** Close the Edit dialog and clear the selected test id. */
  const closeEditDialog = () => {
    setEditTestId(null);
  };

  /**
   * View — navigates to the Question Builder for the selected test.
   * No separate read-only preview route is defined in the assignment or API docs,
   * so the Question Builder (which loads test data by testId) is the correct destination.
   */
  const handleView = (id: string) => {
    navigate(`${ROUTES.TESTS.QUESTIONS}?testId=${id}`);
  };

  /**
   * DELETE /tests/:id does not exist in the backend API documentation.
   * The button is left permanently disabled rather than wired to a no-op.
   * Wire useDeleteTestMutation here if the endpoint is added in future.
   */
  const handleDelete = undefined;

  return {
    tests,
    isLoading,
    isFetching,
    isError,
    error,
    editTestId,
    closeEditDialog,
    handleCreateNew,
    handleEdit,
    handleView,
    handleDelete,
  };
}
