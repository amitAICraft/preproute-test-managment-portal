import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

// reusable page container
export function PageContainer({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('bg-background flex min-h-screen w-full flex-col', className)} {...props} />
  );
}
