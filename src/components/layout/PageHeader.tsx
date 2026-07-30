import { cn } from '@/lib/utils';
import type { HTMLAttributes, ReactNode } from 'react';

interface PageHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}
//Reusable pageheader layout
export function PageHeader({ title, description, actions, className, ...props }: PageHeaderProps) {
  return (
    <div
      className={cn(
        'mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center',
        className,
      )}
      {...props}
    >
      <div className="space-y-1">
        <h1 className="text-foreground text-2xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}
