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
    <div
      className="
        w-full h-full
        bg-white
        rounded-xl
        border border-blue-100
        shadow-sm
        flex flex-col justify-center
        px-8 sm:px-12 lg:px-16 py-10 lg:py-16
      "
    >
      {children}
    </div>
  );
}
