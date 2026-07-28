import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '../ui/input';

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
        'flex items-center gap-4 rounded-md border bg-white p-3 transition-colors',
        isCorrect ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200',
        className
      )}
    >
      <button
        type="button"
        onClick={onSelectCorrect}
        className="flex size-5 shrink-0 items-center justify-center rounded-full border-2 border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {isCorrect && <div className="size-2.5 rounded-full bg-blue-500" />}
      </button>

      <Input
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
      />

      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="text-slate-400 hover:text-red-500 transition-colors focus:outline-none"
        >
          <Trash2 className="size-5" />
        </button>
      )}
    </div>
  );
}
