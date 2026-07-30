import { Link } from 'react-router';
import { FileQuestion, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * NotFound -404 page for ny unmatched routes.
 */
export function NotFound() {
  return (
    <div className="bg-background flex h-screen w-screen flex-col items-center justify-center gap-8 px-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="bg-muted flex size-20 items-center justify-center rounded-full">
          <FileQuestion className="text-muted-foreground size-10" />
        </div>
        <h1 className="text-foreground text-6xl font-bold tracking-tighter">404</h1>
        <h2 className="text-foreground text-xl font-semibold">Page Not Found</h2>
        <p className="text-muted-foreground max-w-md text-sm">
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
