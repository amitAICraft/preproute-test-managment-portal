import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

interface FormErrorProps extends HTMLAttributes<HTMLSpanElement> {
  error?: string;
}

export function FormError({ error, className, id, ...props }: FormErrorProps) {
  if (!error) return null;

  return (
    <span
      id={id}
      className={cn('text-xs text-destructive mt-0', className)}
      {...props}
    >
      {error}
    </span>
  );
}
