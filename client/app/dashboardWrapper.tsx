"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { AuthProvider, useAuth, LoginForm, UserProfile } from "./authProvider"; 
import RequestPasswordResetForm from "./RequestPasswordResetForm";
import SignupForm from "./SignupForm";
import StoreProvider, { useAppSelector } from "./redux";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );
  const [isResettingPassword, setIsResettingPassword] = useState<boolean>(false);
  const [isSigningUp, setIsSigningUp] = useState<boolean>(false); // New state
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  });

  const handlePasswordReset = () => {
    setIsResettingPassword((prevState) => !prevState);
  };

  const handleSignup = () => {
    setIsSigningUp((prevState) => !prevState); // Toggle signup state
  };

  return (
    <div className="flex min-h-screen w-full bg-gray-50 text-gray-900">
      {user ? (
        <>
          <Sidebar />
          <main
            className={`flex w-full flex-col bg-gray-50 dark:bg-dark-bg ${
              isSidebarCollapsed ? "" : "md:pl-64"
            }`}
          >
            <Navbar />
            {children}
          </main>
        </>
      ) : (
        <div className="flex flex-col justify-center items-center w-full h-screen">
          {isSigningUp ? (
            <SignupForm handleBackToLogin={handleSignup} /> // Render signup form
          ) : isResettingPassword ? (
            <RequestPasswordResetForm  />
          ) : (
            <LoginForm 
              handlePasswordReset={handlePasswordReset} 
              handleSignup={handleSignup} // Pass signup handler
            />
          )}
        </div>
      )}
    </div>
  );
};

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      <AuthProvider>
        <DashboardLayout>{children}</DashboardLayout>
      </AuthProvider>
    </StoreProvider>
  );
};

export default DashboardWrapper;
