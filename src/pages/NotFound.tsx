import { Link } from 'react-router';
import { FileQuestion, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * NotFound — 404 page for unmatched routes.
 */
export function NotFound() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-8 bg-background px-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex size-20 items-center justify-center rounded-full bg-muted">
          <FileQuestion className="size-10 text-muted-foreground" />
        </div>
        <h1 className="text-6xl font-bold tracking-tighter text-foreground">404</h1>
        <h2 className="text-xl font-semibold text-foreground">Page Not Found</h2>
        <p className="max-w-md text-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Check the URL or
          head back to the home page.
        </p>
      </div>
      <Button asChild variant="default" className="gap-2">
        <Link to="/">
          <ArrowLeft className="size-4" />
          Go Home
        </Link>
      </Button>
    </div>
  );
}
