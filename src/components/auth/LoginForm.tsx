"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import FormInput from "@/components/ui/FormInput";
import OpaqueButton from "@/components/ui/OpaqueButton";
import {
  mockLogin,
  MOCK_TEST_CREDENTIALS,
  isExternalUrl,
} from "@/lib/mockAuth";
import { SMOOTH_EASE, DURATION } from "@/lib/animations";

/**
 * Login form with email/password fields and forgot password link.
 * Redirects users to their role-specific portal after successful login.
 */
export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });

  const validateLogin = (value: string) => {
    if (!value) return "Email is required";
    if (value === MOCK_TEST_CREDENTIALS.login) return "";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "Please enter a valid email";
    return "";
  };

  const emailError = touched.email ? validateLogin(email) : "";
  const passwordError = touched.password && !password ? "Password is required" : "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    const emailErr = validateLogin(email);
    if (emailErr || !password) {
      setError(emailErr || "Password is required");
      return;
    }

    setIsLoading(true);
    setError("");

    const result = await mockLogin(email, password);

    if (result.success && result.redirectUrl) {
      if (isExternalUrl(result.redirectUrl)) {
        window.location.href = result.redirectUrl;
      } else {
        router.push(result.redirectUrl);
      }
    } else if (result.success) {
      router.push("/profile");
    } else {
      setError(result.error || "Login failed");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <FormInput
          label="Email or Test Login"
          type="text"
          value={email}
          onChange={setEmail}
          onBlur={() => setTouched((t) => ({ ...t, email: true }))}
          error={emailError}
          placeholder='your@email.com or "test"'
          required
          autoComplete="username"
          disabled={isLoading}
        />

        <FormInput
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          onBlur={() => setTouched((t) => ({ ...t, password: true }))}
          error={passwordError}
          placeholder="Enter your password"
          required
          autoComplete="current-password"
          disabled={isLoading}
        />

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

        <Link
          href="/log-in/forgot-password"
          className="w-fit text-sm text-white/50 transition-colors duration-300 hover:text-[var(--color-brand)]"
          style={{ fontFamily: "var(--font-geist-mono), monospace" }}
        >
          Forgot password?
        </Link>

        <div className="mt-2">
          <OpaqueButton
            type="submit"
            variant="brand"
            disabled={isLoading}
            className={`lg:!w-full ${isLoading ? "cursor-wait" : ""}`}
          >
            {isLoading ? "Logging in..." : "Log In"}
          </OpaqueButton>
        </div>
      </form>
    </div>
  );
}
