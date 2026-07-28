import { useNavigate } from 'react-router';
import { useTests } from '@/features/tests';
import { ROUTES } from '@/constants/routes';

/**
 * useDashboard — encapsulates all business logic for the Dashboard page.
 *
 * The page component remains a pure renderer.
 * If a delete API is added in future, wire it here — not in the component.
 */
export function useDashboard() {
  const navigate = useNavigate();
  const { tests, isLoading, isFetching, isError, error } = useTests();

  const handleCreateNew = () => {
    navigate(ROUTES.TESTS.CREATE);
  };

  /** Navigate to the Question Builder for an existing test. */
  const handleEdit = (id: string) => {
    navigate(`${ROUTES.TESTS.QUESTIONS}?testId=${id}`);
  };

  /**
   * View is the same destination as edit for now — a future /tests/:id/preview
   * route can replace this without touching the page component.
   */
  const handleView = (id: string) => {
    navigate(`${ROUTES.TESTS.QUESTIONS}?testId=${id}`);
  };

  /**
   * DELETE /tests/:id does not exist in the current backend.
   * Leave `handleDelete` as undefined so the table can disable the button
   * gracefully rather than wiring a silent no-op.
   *
   * Uncomment the block below and add `useDeleteTestMutation` to testApi
   * when the backend supports deletion.
   *
   * const [deleteTest] = useDeleteTestMutation();
   * const handleDelete = async (id: string) => {
   *   await deleteTest(id).unwrap();
   *   toast.success(TEST_MESSAGES.DELETE.SUCCESS);
   * };
   */
  const handleDelete = undefined;

  return {
    tests,
    isLoading,
    isFetching,
    isError,
    error,
    handleCreateNew,
    handleEdit,
    handleView,
    handleDelete,
  };
}
