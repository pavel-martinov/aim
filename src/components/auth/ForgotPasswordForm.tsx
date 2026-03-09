"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import FormInput from "@/components/ui/FormInput";
import OpaqueButton from "@/components/ui/OpaqueButton";
import { mockSendResetEmail } from "@/lib/mockAuth";
import { SMOOTH_EASE, DRAMATIC_EASE, DURATION } from "@/lib/animations";

/**
 * Forgot password form - email input with success state.
 */
export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [touched, setTouched] = useState(false);

  const validateEmail = (value: string) => {
    if (!value) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "Please enter a valid email";
    return "";
  };

  const emailError = touched ? validateEmail(email) : "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);

    const emailErr = validateEmail(email);
    if (emailErr) {
      setError(emailErr);
      return;
    }

    setIsLoading(true);
    setError("");

    const result = await mockSendResetEmail(email);

    if (result.success) {
      setIsSuccess(true);
    } else {
      setError(result.error || "Failed to send reset email");
    }
    setIsLoading(false);
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.standard, ease: DRAMATIC_EASE }}
        className="flex flex-col gap-6"
      >
        {/* Success icon */}
        <div className="flex size-16 items-center justify-center rounded-full bg-[var(--color-brand)]/20">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            className="text-[var(--color-brand)]"
          >
            <path
              d="M9 12l2 2 4-4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>

        <div className="flex flex-col gap-2">
          <h2
            className="text-2xl text-white"
            style={{ fontFamily: "var(--font-anton), sans-serif" }}
          >
            Check Your Email
          </h2>
          <p
            className="text-base text-white/60"
            style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
          >
            We&apos;ve sent a password reset link to{" "}
            <span className="text-white">{email}</span>
          </p>
        </div>

        <Link
          href="/log-in"
          className="mt-4 w-fit text-sm text-white/50 transition-colors duration-300 hover:text-[var(--color-brand)]"
          style={{ fontFamily: "var(--font-geist-mono), monospace" }}
        >
          ← Back to login
        </Link>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <FormInput
        label="Email"
        type="email"
        value={email}
        onChange={setEmail}
        onBlur={() => setTouched(true)}
        error={emailError}
        placeholder="your@email.com"
        hint="We'll send you a link to reset your password"
        required
        autoComplete="email"
        disabled={isLoading}
      />

      {/* Global error message */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -6, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -6, height: 0 }}
            transition={{ duration: DURATION.fast, ease: SMOOTH_EASE }}
            className="text-sm text-red-400"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Submit button */}
      <div className="mt-2">
        <OpaqueButton
          type="submit"
          variant="brand"
          disabled={isLoading}
          className={isLoading ? "cursor-wait opacity-70" : ""}
        >
          {isLoading ? "Sending..." : "Send Reset Link"}
        </OpaqueButton>
      </div>

      {/* Back to login link */}
      <Link
        href="/log-in"
        className="w-fit text-sm text-white/50 transition-colors duration-300 hover:text-[var(--color-brand)]"
        style={{ fontFamily: "var(--font-geist-mono), monospace" }}
      >
        ← Back to login
      </Link>
    </form>
  );
}
