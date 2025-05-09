
import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showLeftPanel?: boolean;
  leftPanelContent?: React.ReactNode;
  className?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title = "Welcome Back",
  subtitle = "Sign in to access your account",
  showLeftPanel = true,
  leftPanelContent,
  className = "",
}) => {
  const defaultLeftPanelContent = (
    <div className="text-white max-w-md">
      <h1 className="text-4xl font-bold mb-4">Welcome to Our Platform</h1>
      <p className="text-lg opacity-90">
        Join thousands of users who trust our platform for their daily needs.
      </p>
    </div>
  );

  return (
    <div className={`flex min-h-screen ${className}`}>
      {/* Left side with image/design (hidden on mobile) */}
      {showLeftPanel && (
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-auth-primary to-auth-tertiary items-center justify-center p-8">
          {leftPanelContent || defaultLeftPanelContent}
        </div>
      )}

      {/* Right side with form */}
      <div className={`w-full ${showLeftPanel ? 'md:w-1/2' : ''} flex items-center justify-center p-4 bg-gray-50`}>
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg animate-fade-in">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-auth-dark">
              {title}
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              {subtitle}
            </p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
