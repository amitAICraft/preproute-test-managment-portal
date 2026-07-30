import { forwardRef, useState, useRef, useEffect, type ComponentProps } from 'react';
import { FormField } from './FormField';
import { cn } from '@/lib/utils';
import { ChevronDown, X } from 'lucide-react';

export interface SelectOption {
  label: string;
  value: string;
}

export interface MultiSelectFieldProps extends Omit<ComponentProps<'div'>, 'onChange'> {
  label: string;
  name: string;
  error?: string;
  options: readonly SelectOption[];
  placeholder?: string;
  value?: string[];
  onChange?: (value: string[]) => void;
  disabled?: boolean;
}

export const MultiSelectField = forwardRef<HTMLDivElement, MultiSelectFieldProps>(
  (
    {
      label,
      name,
      error,
      options,
      placeholder,
      className,
      value = [],
      onChange,
      disabled,
      id,
      ...props
    },
    ref,
  ) => {
    const fieldId = id || name;
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close dropdown , when clicking outside
    useEffect(() => {
      const handleOutsideClick = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener('mousedown', handleOutsideClick);
      return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    const toggleOption = (optValue: string) => {
      const newValue = value.includes(optValue)
        ? value.filter((v) => v !== optValue)
        : [...value, optValue];
      onChange?.(newValue);
    };

    return (
      <FormField label={label} name={name} error={error} className={className}>
        <div ref={containerRef} className="relative w-full">
          <div
            ref={ref}
            id={fieldId}
            aria-invalid={!!error}
            aria-describedby={error ? `${fieldId}-error` : undefined}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            className={cn(
              'border-input focus-visible:ring-ring/50 flex min-h-[48px] w-full flex-wrap items-center gap-1 rounded-md border bg-transparent px-3 py-1.5 pr-8 text-sm shadow-xs transition-colors focus-visible:ring-[3px] focus-visible:outline-none',
              disabled ? 'cursor-not-allowed bg-slate-50 opacity-50' : 'cursor-pointer',
              error && 'border-destructive focus-visible:ring-destructive/50',
            )}
            {...props}
          >
            {!value || value.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              value.map((v) => {
                const opt = options.find((o) => o.value === v);
                if (!opt) return null;
                return (
                  <span
                    key={v}
                    className="flex items-center gap-1 rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-800"
                  >
                    {opt.label}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!disabled) toggleOption(v);
                      }}
                      className="hover:text-destructive focus:outline-none"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                );
              })
            )}
            <ChevronDown className="text-muted-foreground pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2" />
          </div>

          {isOpen && (
            <div className="bg-popover text-popover-foreground absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white shadow-md">
              {options.length === 0 ? (
                <div className="text-muted-foreground p-2 text-center text-sm">
                  No options available
                </div>
              ) : (
                options.map((opt) => {
                  const isSelected = value.includes(opt.value);
                  return (
                    <div
                      key={opt.value}
                      onClick={() => toggleOption(opt.value)}
                      className={cn(
                        'flex cursor-pointer items-center justify-between px-3 py-2 text-sm hover:bg-slate-50',
                        isSelected && 'bg-blue-50 font-medium text-blue-900',
                      )}
                    >
                      {opt.label}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </FormField>
    );
  },
);

MultiSelectField.displayName = 'MultiSelectField';
