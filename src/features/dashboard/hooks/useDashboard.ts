import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTests } from '@/features/tests';
import { ROUTES } from '@/constants/routes';

// useDashboard — encapsulates all business logic for the Dashboard page.

export function useDashboard() {
  const navigate = useNavigate();
  const { tests, isLoading, isFetching, isError, error } = useTests();

  /** ID of the test currently being edited in the dialog. null = dialog closed. */
  const [editTestId, setEditTestId] = useState<string | null>(null);

  const handleCreateNew = () => {
    navigate(ROUTES.TESTS.CREATE);
  };

// Edit — opens the EditTestDialog modal with the selected test pre-loaded.
  const handleEdit = (id: string) => {
    setEditTestId(id);
  };

//Close the Edit dialog and clear the selected test id.
  const closeEditDialog = () => {
    setEditTestId(null);
  };

//  View — navigates to the Question Builder for the selected test.

  const handleView = (id: string) => {
    navigate(`${ROUTES.TESTS.QUESTIONS}?testId=${id}`);
  };

// DELETE /tests/:id does not exist in the backend API documentation.

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
