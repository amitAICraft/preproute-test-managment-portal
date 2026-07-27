import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

export function SectionCard({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('bg-card text-card-foreground rounded-xl border border-border shadow-sm p-6', className)}
      {...props}
    />
  );
}
