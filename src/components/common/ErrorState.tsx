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
      className={cn('flex items-start gap-3 rounded-md bg-destructive/10 p-4 text-destructive', className)}
      {...props}
    >
      <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
      <div className="space-y-1">
        {title && <h4 className="font-medium leading-none">{title}</h4>}
        <div className="text-sm">{message}</div>
      </div>
    </div>
  );
}
