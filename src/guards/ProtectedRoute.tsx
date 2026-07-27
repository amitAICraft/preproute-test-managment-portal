import { Navigate, Outlet } from 'react-router';
import { useAppSelector } from '@/app/hooks';
import { selectIsAuthenticated } from '@/features/auth/authSlice';

/**
 * ProtectedRoute — wraps routes that require authentication.
 *
 * If the user is not authenticated, redirects to `/login`.
 * Otherwise, renders the child route via `<Outlet />`.
 */
export function ProtectedRoute() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
