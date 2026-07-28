import { cn } from '@/lib/utils';

export interface RadioOption {
  label: string;
  value: string;
}

interface RadioGroupProps {
  options: readonly RadioOption[];
  value: string;
  onChange: (value: string) => void;
  name?: string;
  className?: string;
}

export function RadioGroup({ options, value, onChange, name, className }: RadioGroupProps) {
  return (
    <div className={cn('flex items-center justify-between h-12 w-full', className)}>
      {options.map((option) => {
        const isSelected = value === option.value;
        return (
          <label
            key={option.value}
            className="group flex cursor-pointer items-center gap-3"
          >
            <div
              className={cn(
                'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all',
                isSelected
                  ? 'border-[6px] border-blue-500 bg-white'
                  : 'border-slate-300 group-hover:border-blue-400'
              )}
            />
            <span className="text-[16px] font-medium text-[#374151]">
              {option.label}
            </span>
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={isSelected}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
          </label>
        );
      })}
    </div>
  );
}
