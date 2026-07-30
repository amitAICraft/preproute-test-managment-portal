import { forwardRef, type ComponentProps } from 'react';
import { Input } from '@/components/ui/input';
import { FormField } from './FormField';
import { cn } from '@/lib/utils';

export interface TextFieldProps extends ComponentProps<'input'> {
  label: string;
  name: string;
  error?: string;
}
//Reusable text field
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, name, error, className, id, ...props }, ref) => {
    // We expect 'name' to be passed by react-hook-form
    const fieldId = id || name;

    return (
      <FormField label={label} name={name} error={error} className={className}>
        <Input
          id={fieldId}
          name={name}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={error ? `${fieldId}-error` : undefined}
          className={cn(error && 'border-destructive focus-visible:ring-destructive/50')}
          {...props}
        />
      </FormField>
    );
  },
);

TextField.displayName = 'TextField';
