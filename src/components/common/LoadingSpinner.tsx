import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SVGProps } from 'react';

interface LoadingSpinnerProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

export function LoadingSpinner({ className, size = 24, ...props }: LoadingSpinnerProps) {
  return (
    <Loader2
      size={size}
      className={cn('text-muted-foreground animate-spin', className)}
      aria-hidden="true"
      {...props}
    />
  );
}
