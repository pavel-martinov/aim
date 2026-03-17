"use client";

import { useEffect, useState } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginContent() {
  const [headline, setHeadline] = useState("");

  useEffect(() => {
    const hasRole = localStorage.getItem("aim-role");
    setHeadline(hasRole ? "Welcome Back" : "Log In");
  }, []);

  if (!headline) {
    return <div className="min-h-screen w-full" />; // Prevent layout animation until we know the text
  }

  return (
    <AuthLayout headline={headline}>
      <LoginForm />
    </AuthLayout>
  );
}
