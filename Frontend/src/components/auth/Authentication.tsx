
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import AuthLayout from "./AuthLayout";

interface AuthenticationProps {
  onLoginSuccess?: (email: string, password: string) => void;
  onRegisterSuccess?: (name: string, email: string, password: string) => void;
  onLoginError?: (error: string) => void;
  onRegisterError?: (error: string) => void;
  defaultTab?: "login" | "register";
  showRegisterTab?: boolean;
  loginTitle?: string;
  registerTitle?: string;
  subtitle?: string;
  showLeftPanel?: boolean;
  leftPanelContent?: React.ReactNode;
  className?: string;
}

const Authentication: React.FC<AuthenticationProps> = ({
  onLoginSuccess,
  onRegisterSuccess,
  onLoginError,
  onRegisterError,
  defaultTab = "login",
  showRegisterTab = true,
  loginTitle = "Login",
  registerTitle = "Register",
  subtitle,
  showLeftPanel = true,
  leftPanelContent,
  className,
}) => {
  const [activeTab, setActiveTab] = useState<string>(defaultTab);

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <AuthLayout
      title={activeTab === "login" ? "Welcome Back" : "Create an Account"}
      subtitle={subtitle || (activeTab === "login" ? "Sign in to access your account" : "Register to get started")}
      showLeftPanel={showLeftPanel}
      leftPanelContent={leftPanelContent}
      className={className}
    >
      {showRegisterTab ? (
        <Tabs
          defaultValue={defaultTab}
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">{loginTitle}</TabsTrigger>
            <TabsTrigger value="register">{registerTitle}</TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="mt-6">
            <LoginForm
              onLoginSuccess={onLoginSuccess}
              onLoginError={onLoginError}
            />
          </TabsContent>
          <TabsContent value="register" className="mt-6">
            <RegisterForm
              onRegisterSuccess={onRegisterSuccess}
              onRegisterError={onRegisterError}
            />
          </TabsContent>
        </Tabs>
      ) : (
        <LoginForm
          onLoginSuccess={onLoginSuccess}
          onLoginError={onLoginError}
        />
      )}
    </AuthLayout>
  );
};

export default Authentication;
