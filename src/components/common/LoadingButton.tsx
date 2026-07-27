import { Button } from '@/components/ui/button';
import { LoadingSpinner } from './LoadingSpinner';
import type { ComponentProps, ReactNode } from 'react';

type ButtonElementProps = ComponentProps<typeof Button>;

export interface LoadingButtonProps extends ButtonElementProps {
  isLoading?: boolean;
  loadingText?: string;
  children: ReactNode;
}

export function LoadingButton({
  isLoading,
  loadingText,
  children,
  disabled,
  ...props
}: LoadingButtonProps) {
  return (
    <Button disabled={isLoading || disabled} {...props}>
      {isLoading ? (
        <>
          <LoadingSpinner size={16} className="mr-2 text-current" />
          {loadingText ? <span>{loadingText}</span> : children}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
