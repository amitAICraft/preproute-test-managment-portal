import type { ReactNode } from 'react';

/**
 * LoginCard — White floating card on the right panel.
 *
 * Matches 01-login-page.png:
 * - Full available height with top/bottom padding (not a small centered box)
 * - Thin light-blue/slate border
 * - Rounded corners (xl)
 * - Minimal shadow
 * - Content top-aligned with generous padding on all sides
 */
export function LoginCard({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full w-full flex-col justify-center rounded-lg border border-blue-100 bg-white px-8 py-10 shadow-sm sm:px-12 lg:px-16 lg:py-16">
      {children}
    </div>
  );
}
