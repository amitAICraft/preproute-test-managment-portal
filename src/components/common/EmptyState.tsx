import { cn } from '@/lib/utils';
import type { HTMLAttributes, ReactNode } from 'react';

interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action, className, ...props }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-border bg-slate-50/50',
        className
      )}
      {...props}
    >
      {icon && <div className="mb-4 text-muted-foreground/60">{icon}</div>}
      <h3 className="text-lg font-medium text-foreground mb-1">{title}</h3>
      {description && <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-4">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
}
