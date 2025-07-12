import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, RefreshCw, Home, Bug } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId?: string;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Generate unique error ID for tracking
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    this.setState({
      error,
      errorInfo,
      errorId
    });

    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    // In production, you would send this to your error reporting service
    // Example: Sentry, LogRocket, etc.
    if (import.meta.env.PROD) {
      this.reportError(error, errorInfo, errorId);
    }
  }

  private reportError = (error: Error, errorInfo: ErrorInfo, errorId: string) => {
    // This is where you would send the error to your error reporting service
    // For now, we'll just log it
    console.error("Error reported:", {
      errorId,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });
  };

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined, errorId: undefined });
  };

  private handleGoHome = () => {
    window.location.href = "/";
  };

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md border-2 border-dashed border-red-300 bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-orange-100 rounded-full border-4 border-dashed border-red-300 flex items-center justify-center mx-auto mb-4 transform rotate-2">
                <Bug className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-800 mb-2">
                Oops! Something went wrong
              </CardTitle>
              <p className="text-gray-600">
                We encountered an unexpected error. Don't worry, our team has been notified.
              </p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Error Details (only in development) */}
              {import.meta.env.DEV && this.state.error && (
                <Alert className="bg-red-50 border-red-200">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    <div className="font-mono text-xs">
                      <div><strong>Error:</strong> {this.state.error.message}</div>
                      {this.state.errorId && (
                        <div><strong>Error ID:</strong> {this.state.errorId}</div>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* Error ID for user reporting */}
              {this.state.errorId && (
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    Error ID: <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">{this.state.errorId}</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    Please include this ID when reporting the issue.
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button 
                  onClick={this.handleRetry} 
                  className="w-full bg-blue-500 hover:bg-blue-600"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={this.handleGoHome} 
                    variant="outline" 
                    className="flex-1"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Go Home
                  </Button>
                  
                  <Button 
                    onClick={this.handleReload} 
                    variant="outline" 
                    className="flex-1"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reload Page
                  </Button>
                </div>
              </div>

              {/* Help Text */}
              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  If this problem persists, please contact our support team.
                </p>
                <div className="flex justify-center gap-4 mt-2 text-xs">
                  <a 
                    href="mailto:support@skillswap-dao.com" 
                    className="text-blue-600 hover:underline"
                  >
                    Email Support
                  </a>
                  <a 
                    href="https://github.com/your-username/skillswap-dao/issues" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Report Issue
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 