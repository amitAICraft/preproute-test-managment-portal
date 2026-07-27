import { cn } from '@/lib/utils';
import * as React from 'react';

export interface TabOption {
  label: string;
  value: string;
}

interface TabsProps {
  options: readonly TabOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function Tabs({ options, value, onChange, className }: TabsProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center justify-center rounded-xl border border-border bg-slate-50/50 p-1 text-muted-foreground',
        className
      )}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            'inline-flex items-center justify-center whitespace-nowrap rounded-lg px-8 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
            value === option.value
              ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200/50'
              : 'hover:bg-slate-100 hover:text-foreground'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
