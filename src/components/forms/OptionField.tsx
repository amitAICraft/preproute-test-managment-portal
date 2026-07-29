import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OptionFieldProps {
  id: string;
  text: string;
  isCorrect: boolean;
  onTextChange: (text: string) => void;
  onSelectCorrect: () => void;
  onDelete?: () => void;
  placeholder?: string;
  className?: string;
  error?: string;
  disabled?: boolean;
}

export function OptionField({
  text,
  isCorrect,
  onTextChange,
  onSelectCorrect,
  onDelete,
  placeholder = 'Type Option here',
  className,
  error,
  disabled,
}: OptionFieldProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg border px-4 py-2.5 transition-colors',
        error ? 'border-red-500' : isCorrect ? 'border-blue-500 bg-blue-50/40' : 'border-slate-200 hover:border-slate-300',
        disabled ? 'bg-slate-50 border-slate-200 cursor-not-allowed opacity-75' : 'bg-white',
        className,
      )}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={onSelectCorrect}
        className={cn(
          'flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-all focus:outline-none',
          isCorrect ? 'border-[#7489FF] bg-white' : 'border-slate-300 hover:border-slate-400',
          disabled && 'cursor-not-allowed opacity-50',
        )}
      >
        {isCorrect && <div className="size-2.5 rounded-full bg-[#7489FF]" />}
      </button>

      <input
        type="text"
        value={text}
        disabled={disabled}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder={placeholder}
        aria-invalid={!!error}
        className={cn(
          "flex-1 border-0 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:ring-0 focus:outline-none",
          disabled && "cursor-not-allowed"
        )}
      />

      {onDelete && !disabled && (
        <button
          type="button"
          onClick={onDelete}
          className="text-slate-400 transition-colors hover:text-red-500 focus:outline-none"
        >
          <Trash2 className="size-4" />
        </button>
      )}
    </div>
  );
}
