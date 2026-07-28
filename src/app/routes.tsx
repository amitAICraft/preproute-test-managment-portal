import { createBrowserRouter, Navigate } from 'react-router';
import { ProtectedRoute } from '@/guards/ProtectedRoute';
import { PublicRoute } from '@/guards/PublicRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import { NotFound } from '@/pages/NotFound';

import { LoginPage } from '@/features/auth/pages/LoginPage';
import { CreateTestPage, QuestionBuilderPage, PublishTestPage } from '@/features/tests';
import { DashboardPage } from '@/features/dashboard';

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
            element: <DashboardPage />,
          },
          {
            path: 'tests/create',
            element: <CreateTestPage />,
          },
          {
            path: 'tests/create/questions',
            element: <QuestionBuilderPage />,
          },
          {
            path: 'tests/create/publish',
            element: <PublishTestPage />,
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
