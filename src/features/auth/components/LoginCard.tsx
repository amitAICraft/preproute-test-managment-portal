import type { ReactNode } from 'react';

/**
 * LoginCard — A layout wrapper for the right panel of the login screen.
 */
export function LoginCard({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col justify-center px-8 md:px-16 lg:px-24 border-l border-border bg-white">
      <div className="w-full max-w-sm mx-auto">
        {children}
      </div>
    </div>
  );
}
