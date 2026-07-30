import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';

interface ProvidersProps {
  children: ReactNode;
}

//Add new providers here (e.g. ThemeProvider, AuthProvider) to keep
//the component tree clean and centralized.
export function Providers({ children }: ProvidersProps) {
  return <Provider store={store}>{children}</Provider>;
}
