import { Loader2 } from 'lucide-react';

/**
 * LoadingScreen — full-viewport loading indicator.
 * Displayed during lazy-loaded route transitions or initial data fetching.
 */
export function LoadingScreen() {
  return (
    <div className="bg-background flex h-screen w-screen flex-col items-center justify-center gap-4">
      <Loader2 className="text-primary size-10 animate-spin" />
      <p className="text-muted-foreground text-sm font-medium">Loading...</p>
    </div>
  );
}
