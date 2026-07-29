import { cn } from '@/lib/utils';

export interface TabOption {
  label: string;
  value: string;
  disabled?: boolean;
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
        'border-border text-muted-foreground inline-flex items-center justify-center rounded-xl border bg-slate-50/50 p-1',
        className,
      )}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          disabled={option.disabled}
          onClick={() => onChange(option.value)}
          className={cn(
            'focus-visible:ring-ring inline-flex items-center justify-center rounded-lg px-8 py-2 text-sm font-medium whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:text-slate-400 disabled:opacity-40',
            value === option.value
              ? 'bg-white text-[#7489FF] shadow-sm ring-1 ring-slate-200/50'
              : 'hover:text-foreground text-slate-500 hover:bg-slate-100',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
