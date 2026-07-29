import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

interface FormErrorProps extends HTMLAttributes<HTMLSpanElement> {
  error?: string;
}

/**
 * FormError — reserved-height error message slot.
 *
 * Always renders in the DOM so that the parent FormField height
 * never changes when errors appear or disappear.
 * The min-h ensures a stable layout regardless of validation state.
 */
export function FormError({ error, className, id, ...props }: FormErrorProps) {
  return (
    <span
      id={id}
      role={error ? 'alert' : undefined}
      aria-live="polite"
      className={cn(
        'absolute top-0 left-0 z-10 w-full block min-h-[1.25rem] text-xs text-destructive leading-tight',
        !error && 'invisible',
        className,
      )}
      {...props}
    >
      {error ?? '\u00A0'}{/* non-breaking space keeps line height when empty */}
    </span>
  );
}

