import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';
import type { HTMLAttributes, ReactNode } from 'react';

interface ErrorStateProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  message: ReactNode;
}

export function ErrorState({ title, message, className, ...props }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        'bg-destructive/10 text-destructive flex items-start gap-3 rounded-md p-4',
        className,
      )}
      {...props}
    >
      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
      <div className="space-y-1">
        {title && <h4 className="leading-none font-medium">{title}</h4>}
        <div className="text-sm">{message}</div>
      </div>
    </div>
  );
}
