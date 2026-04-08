"use client";

import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";

/** Login page content for the V1 player/coach chooser. */
export default function LoginContent() {
  return (
    <AuthLayout
      headline="Log In"
      subheadline="Choose whether you are continuing as a player or a coach."
    >
      <LoginForm />
    </AuthLayout>
  );
}
