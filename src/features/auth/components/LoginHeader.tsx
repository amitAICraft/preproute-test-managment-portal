import { MESSAGES } from '@/constants/messages';

/**
 * LoginHeader — Logo + page title + subtitle for the login form.
 *
 * Uses the official preproute-logo.svg asset instead of text.
 * Vertical rhythm is tuned to match 01-login-page.png.
 */
export function LoginHeader() {
  return (
    <>
      {/* Logo */}
      <div className="mb-8">
        <img src="/preproute-logo.svg" alt="PrepRoute" className="h-8 w-auto" />
      </div>

      {/* Titles */}
      <div className="mb-8 space-y-3">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">{MESSAGES.LOGIN.TITLE}</h1>
        <p className="text-sm text-slate-500">Use your company provided Login credentials</p>
      </div>
    </>
  );
}
