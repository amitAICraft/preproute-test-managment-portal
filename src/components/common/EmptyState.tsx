import { cn } from '@/lib/utils';
import type { HTMLAttributes, ReactNode } from 'react';

interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'border-border flex flex-col items-center justify-center rounded-xl border border-dashed bg-slate-50/50 p-8 text-center',
        className,
      )}
      {...props}
    >
      {icon && <div className="text-muted-foreground/60 mb-4">{icon}</div>}
      <h3 className="text-foreground mb-1 text-lg font-medium">{title}</h3>
      {description && (
        <p className="text-muted-foreground mx-auto mb-4 max-w-sm text-sm">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
