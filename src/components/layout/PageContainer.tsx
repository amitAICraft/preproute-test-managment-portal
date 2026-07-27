import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

export function PageContainer({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('min-h-screen w-full bg-background flex flex-col', className)}
      {...props}
    />
  );
}
