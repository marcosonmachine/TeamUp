"use client";

import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/providers/AuthProvider";
import { useState } from 'react';
import { FaGoogle } from "react-icons/fa";

export function LoginButton() {
  const { user, loading, signInWithGoogle, logout } = useAuthContext();
  const [isLoggingIn, setIsLogging] = useState(false);

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator while determining auth state
  }

  if (user) {
    return (
      <Button onClick={logout} variant="destructive">
        Logout
      </Button>
    );
  }

  const handleLogin = async () => {
    try {
      setIsLogging(true);
      await signInWithGoogle();
    } finally {
      setIsLogging(false);
    }
  };

  return (
    <Button onClick={handleLogin} variant="secondary" disabled={isLoggingIn}>
      <FaGoogle />
    Login
    </Button>
  );
} 