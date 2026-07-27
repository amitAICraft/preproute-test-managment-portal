import { LoginForm } from '../components/LoginForm';
import { LoginHero } from '../components/LoginHero';
import { LoginHeader } from '../components/LoginHeader';
import { LoginCard } from '../components/LoginCard';

export function LoginPage() {
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <LoginHero />
      <LoginCard>
        <LoginHeader />
        <LoginForm />
      </LoginCard>
    </div>
  );
}
