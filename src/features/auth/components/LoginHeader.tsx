import { MESSAGES } from '@/constants/messages';

/**
 * LoginHeader — Reusable header for the login form containing the logo and titles.
 */
export function LoginHeader() {
  return (
    <>
      <div className="mb-8 flex items-center gap-2">
        <div className="flex items-center text-3xl font-extrabold tracking-tight text-blue-600">
          {MESSAGES.LOGIN.APP_NAME_PREFIX}<span className="text-blue-500">{MESSAGES.LOGIN.APP_NAME_SUFFIX}</span>
        </div>
      </div>

      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">{MESSAGES.LOGIN.TITLE}</h1>
        <p className="text-sm text-muted-foreground">
          Use your company provided Login credentials
        </p>
      </div>
    </>
  );
}
