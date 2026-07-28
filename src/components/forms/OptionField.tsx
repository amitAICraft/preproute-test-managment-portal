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
}

export function OptionField({
  text,
  isCorrect,
  onTextChange,
  onSelectCorrect,
  onDelete,
  placeholder = 'Type Option here',
  className,
}: OptionFieldProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg border bg-white px-4 py-2.5 transition-colors',
        isCorrect ? 'border-blue-500 bg-blue-50/40' : 'border-slate-200 hover:border-slate-300',
        className
      )}
    >
      <button
        type="button"
        onClick={onSelectCorrect}
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-all focus:outline-none",
          isCorrect ? "border-[#7489FF] bg-white" : "border-slate-300 hover:border-slate-400"
        )}
      >
        {isCorrect && <div className="size-2.5 rounded-full bg-[#7489FF]" />}
      </button>

      <input
        type="text"
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 border-0 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-0"
      />

      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="text-slate-400 hover:text-red-500 transition-colors focus:outline-none"
        >
          <Trash2 className="size-4" />
        </button>
      )}
    </div>
  );
}
