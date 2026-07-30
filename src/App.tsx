import { RouterProvider } from 'react-router';
import { Toaster } from 'sonner';
import { Providers } from '@/app/providers';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { router } from '@/app/routes';

//Main app start here
function App() {
  return (
    <ErrorBoundary>
      <Providers>
        <RouterProvider router={router} />
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            duration: 4000,
          }}
        />
      </Providers>
    </ErrorBoundary>
  );
}

export default App;
