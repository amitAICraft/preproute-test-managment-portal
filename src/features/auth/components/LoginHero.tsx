/**
 * LoginHero — Left panel illustration.
 *
 * Renders the official SVG asset. The panel itself has NO background —
 * it inherits the page background from LoginPage, exactly matching
 * 01-login-page.png where both panels share the same light blue-gray.
 */
export function LoginHero() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <img
        src="/login-left-bar-icon.svg"
        alt="PrepRoute illustration"
        className="w-full max-w-[75%] max-h-[100%] object-contain"
      />
    </div>
  );
}
