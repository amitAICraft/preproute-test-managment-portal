import { forwardRef, type ComponentProps } from 'react';
import { Select } from '@/components/ui/select';
import { FormField } from './FormField';
import { cn } from '@/lib/utils';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectFieldProps extends Omit<ComponentProps<'select'>, 'children'> {
  label: string;
  name: string;
  error?: string;
  options: readonly SelectOption[];
  placeholder?: string;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, name, error, options, placeholder, className, id, ...props }, ref) => {
    const fieldId = id || name;
    
    return (
      <FormField label={label} name={name} error={error} className={className}>
        <Select
          id={fieldId}
          name={name}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={error ? `${fieldId}-error` : undefined}
          className={cn(error && 'border-destructive focus-visible:ring-destructive/50', !props.value && 'text-muted-foreground')}
          {...props}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
      </FormField>
    );
  }
);

SelectField.displayName = 'SelectField';
