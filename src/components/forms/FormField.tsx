import { cn } from '@/lib/utils';
import { FormError } from './FormError';
import type { HTMLAttributes, ReactNode } from 'react';

interface FormFieldProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  name: string;
  error?: string;
  children: ReactNode;
}

/**
 * FormField — stable wrapper for every form input.
 *
 * Structure: label → input → error-slot (always in DOM).
 * The error slot always reserves its height via FormError so that
 * no layout shift occurs when validation messages appear.
 */
export function FormField({ label, name, error, children, className, ...props }: FormFieldProps) {
  return (
    <div className={cn('flex flex-col', className)} {...props}>
      <label htmlFor={name} className="mb-2 text-[16px] leading-[1.5] font-medium text-[#374151]">
        {label}
      </label>
      {children}
      <div className="relative mt-0.5 h-[1.25rem] w-full">
        <FormError id={`${name}-error`} error={error} />
      </div>
    </div>
  );
}
