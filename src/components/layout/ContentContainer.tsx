import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

export function ContentContainer({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('container mx-auto max-w-7xl flex-1 px-4 py-6 md:px-6 md:py-8', className)}
      {...props}
    />
  );
}
