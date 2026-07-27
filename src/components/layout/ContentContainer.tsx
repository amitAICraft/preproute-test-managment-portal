import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

export function ContentContainer({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('container mx-auto px-4 md:px-6 py-6 md:py-8 max-w-7xl flex-1', className)}
      {...props}
    />
  );
}
