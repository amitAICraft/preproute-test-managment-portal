import { cn } from '@/lib/utils';
import { FormError } from './FormError';
import type { HTMLAttributes, ReactNode } from 'react';

interface FormFieldProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  name: string;
  error?: string;
  children: ReactNode;
}

export function FormField({ label, name, error, children, className, ...props }: FormFieldProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)} {...props}>
      <label htmlFor={name} className="text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
      <FormError id={`${name}-error`} error={error} />
    </div>
  );
}
