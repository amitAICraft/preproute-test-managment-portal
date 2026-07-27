import { Loader2 } from 'lucide-react';

/**
 * LoadingScreen — full-viewport loading indicator.
 * Displayed during lazy-loaded route transitions or initial data fetching.
 */
export function LoadingScreen() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-4 bg-background">
      <Loader2 className="size-10 animate-spin text-primary" />
      <p className="text-sm font-medium text-muted-foreground">Loading...</p>
    </div>
  );
}
