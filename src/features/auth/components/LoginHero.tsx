import type { ReactNode } from 'react';

/**
 * LoginHero — The left panel of the login screen matching the Figma split layout.
 * Removes hardcoded CSS art in favor of a clean container ready for actual assets.
 */
export function LoginHero({ children }: { children?: ReactNode }) {
  return (
    <div className="hidden lg:flex flex-1 items-center justify-center bg-slate-50 relative">
      {/* 
        This is the container for the illustration (e.g. laptop character).
        Render children (like an <img />) here when assets are available.
      */}
      <div className="relative flex flex-col items-center justify-center w-full max-w-lg">
        {children}
      </div>
    </div>
  );
}
