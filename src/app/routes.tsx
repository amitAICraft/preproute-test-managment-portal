import { createBrowserRouter, Navigate } from 'react-router';
import { ProtectedRoute } from '@/guards/ProtectedRoute';
import { PublicRoute } from '@/guards/PublicRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import { NotFound } from '@/pages/NotFound';

import { LoginPage } from '@/features/auth/pages/LoginPage';

/**
 * Application route configuration.
 *
 * Structure:
 * ├── / (ProtectedRoute)
 * │   └── AppLayout
 * │       ├── index → redirect to /dashboard
 * │       └── dashboard → placeholder (implement later)
 * ├── /login (PublicRoute)
 * │   └── LoginPage
 * └── * → NotFound
 */
export const router = createBrowserRouter([
  {
    // Protected routes — require authentication
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/dashboard" replace />,
          },
          {
            path: 'dashboard',
            element: (
              <div className="flex items-center justify-center py-20 text-muted-foreground">
                Dashboard — implement in feature module
              </div>
            ),
          },
        ],
      },
    ],
  },
  {
    // Public routes — accessible only when NOT authenticated
    path: '/login',
    element: <PublicRoute />,
    children: [
      {
        index: true,
        element: <LoginPage />,
      },
    ],
  },
  {
    // Catch-all — 404
    path: '*',
    element: <NotFound />,
  },
]);
