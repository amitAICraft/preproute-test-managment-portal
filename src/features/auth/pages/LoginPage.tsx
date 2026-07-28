/**
 * LoginPage — Full-screen split layout matching 01-login-page.png.
 *
 * Both panels share the same light blue-gray page background.
 * Left (~50%): hero illustration centered.
 * Right (~50%): tall white card centered vertically with content
 *               positioned in the upper-middle of the card.
 */
import { LoginForm } from '../components/LoginForm';
import { LoginHero } from '../components/LoginHero';
import { LoginHeader } from '../components/LoginHeader';
import { LoginCard } from '../components/LoginCard';

export function LoginPage() {
  return (
    /* Full page — same background on both panels as in Figma */
    <div className="flex h-screen w-full overflow-hidden" style={{ backgroundColor: '#EAF0F8' }}>

      {/* Left panel — illustration, increased width to match Figma */}
      <div className="hidden lg:flex lg:w-[55%] items-center justify-center">
        <LoginHero />
      </div>

      {/* Right panel — white floating card, reduced outer padding */}
      <div className="flex flex-1 lg:w-[45%] items-center justify-center p-4 lg:p-6">
        <LoginCard>
          <LoginHeader />
          <LoginForm />
        </LoginCard>
      </div>

    </div>
  );
}
