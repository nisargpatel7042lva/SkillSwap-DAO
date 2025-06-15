import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full p-6 bg-white rounded-xl shadow-lg border-2 border-dashed border-red-300">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Oops! Something went wrong</h2>
            <p className="text-gray-600 mb-4">
              We apologize for the inconvenience. An error has occurred.
            </p>
            {process.env.NODE_ENV === 'development' && (
              <div className="mb-4 p-4 bg-gray-100 rounded-lg overflow-auto">
                <p className="text-sm font-mono text-red-500">
                  {this.state.error?.toString()}
                </p>
                <p className="text-sm font-mono text-gray-500 mt-2">
                  {this.state.errorInfo?.componentStack}
                </p>
              </div>
            )}
            <div className="flex space-x-4">
              <Button
                onClick={this.handleReset}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Try Again
              </Button>
              <Button
                onClick={() => window.location.reload()}
                className="bg-gray-500 hover:bg-gray-600 text-white"
              >
                Reload Page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 