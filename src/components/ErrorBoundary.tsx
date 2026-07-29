import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary — catches unhandled rendering errors in the React tree.
 *
 * Displays a styled fallback UI with a retry button.
 * Logs errors to the console (replace with a real error reporting service).
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[ErrorBoundary] Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="bg-background flex h-screen w-screen flex-col items-center justify-center gap-6 px-4">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="bg-destructive/10 flex size-16 items-center justify-center rounded-full">
              <AlertTriangle className="text-destructive size-8" />
            </div>
            <h1 className="text-foreground text-2xl font-bold">Something went wrong</h1>
            <p className="text-muted-foreground max-w-md text-sm">
              An unexpected error occurred. Please try again or contact support if the problem
              persists.
            </p>
            {import.meta.env.DEV && this.state.error && (
              <pre className="bg-muted text-muted-foreground mt-2 max-w-lg overflow-auto rounded-md p-4 text-left text-xs">
                {this.state.error.message}
              </pre>
            )}
          </div>
          <Button onClick={this.handleReset} variant="outline" className="gap-2">
            <RefreshCw className="size-4" />
            Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
