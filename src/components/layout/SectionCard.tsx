import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

//Reusable SectionCard layout
export function SectionCard({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'bg-card text-card-foreground border-border rounded-xl border p-6 shadow-sm',
        className,
      )}
      {...props}
    />
  );
}
