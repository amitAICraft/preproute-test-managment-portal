import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

interface FormErrorProps extends HTMLAttributes<HTMLSpanElement> {
  error?: string;
}

//Display and handled form error here
export function FormError({ error, className, id, ...props }: FormErrorProps) {
  return (
    <span
      id={id}
      role={error ? 'alert' : undefined}
      aria-live="polite"
      className={cn(
        'text-destructive absolute top-0 left-0 z-10 block min-h-[1.25rem] w-full text-xs leading-tight',
        !error && 'invisible',
        className,
      )}
      {...props}
    >
      {error ?? '\u00A0'}
      {/* non-breaking space keeps line height when empty */}
    </span>
  );
}
