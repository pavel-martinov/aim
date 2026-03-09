"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import FormInput from "@/components/ui/FormInput";
import OpaqueButton from "@/components/ui/OpaqueButton";
import { mockResetPassword } from "@/lib/mockAuth";
import { SMOOTH_EASE, DURATION } from "@/lib/animations";

type ResetPasswordFormProps = {
  token: string | null;
};

/**
 * Reset password form with new password and confirm fields.
 */
export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState({ password: false, confirm: false });

  const validatePassword = (value: string) => {
    if (!value) return "Password is required";
    if (value.length < 8) return "Password must be at least 8 characters";
    return "";
  };

  const validateConfirm = (value: string) => {
    if (!value) return "Please confirm your password";
    if (value !== password) return "Passwords do not match";
    return "";
  };

  const passwordError = touched.password ? validatePassword(password) : "";
  const confirmError = touched.confirm ? validateConfirm(confirmPassword) : "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ password: true, confirm: true });

    const passErr = validatePassword(password);
    const confErr = validateConfirm(confirmPassword);
    if (passErr || confErr) {
      setError(passErr || confErr);
      return;
    }

    if (!token) {
      setError("Invalid reset link. Please request a new one.");
      return;
    }

    setIsLoading(true);
    setError("");

    const result = await mockResetPassword(token, password, confirmPassword);

    if (result.success) {
      router.push("/log-in/password-reset-success");
    } else {
      setError(result.error || "Failed to reset password");
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-base text-red-400">
          Invalid or missing reset token. Please request a new password reset link.
        </p>
        <a
          href="/log-in/forgot-password"
          className="w-fit text-sm text-white/50 transition-colors duration-300 hover:text-[var(--color-brand)]"
          style={{ fontFamily: "var(--font-geist-mono), monospace" }}
        >
          ← Request new link
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <FormInput
        label="New Password"
        type="password"
        value={password}
        onChange={setPassword}
        onBlur={() => setTouched((t) => ({ ...t, password: true }))}
        error={passwordError}
        placeholder="Enter new password"
        hint="Must be at least 8 characters"
        required
        autoComplete="new-password"
        disabled={isLoading}
      />

      <FormInput
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={setConfirmPassword}
        onBlur={() => setTouched((t) => ({ ...t, confirm: true }))}
        error={confirmError}
        placeholder="Confirm new password"
        required
        autoComplete="new-password"
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
          {isLoading ? "Resetting..." : "Reset Password"}
        </OpaqueButton>
      </div>
    </form>
  );
}
