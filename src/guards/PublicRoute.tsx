import { Navigate, Outlet } from 'react-router';
import { useAppSelector } from '@/app/hooks';
import { selectIsAuthenticated } from '@/features/auth/authSlice';

//PublicRoute — wraps routes that should only be accessible
//to unauthenticated users (ex login, register).

//If the user is already authenticated, redirects to /.
//Otherwise, renders the child route via <Outlet />.
export function PublicRoute() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
