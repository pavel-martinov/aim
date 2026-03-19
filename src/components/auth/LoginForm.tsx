"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import FormInput from "@/components/ui/FormInput";
import OpaqueButton from "@/components/ui/OpaqueButton";
import {
  mockLogin,
  isExternalUrl,
  saveUserRole,
  EXTERNAL_URLS,
  DEMO_CREDENTIALS,
} from "@/lib/mockAuth";
import { isValidEmail } from "@/lib/utils";
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
  const [showPortalSelection, setShowPortalSelection] = useState(false);

  const validateLogin = (value: string) => {
    if (!value) return "Email is required";
    if (DEMO_CREDENTIALS[value.toLowerCase()]) return "";
    if (!isValidEmail(value)) return "Please enter a valid email";
    return "";
  };

  const emailError = touched.email ? validateLogin(email) : "";
  const passwordError = touched.password && !password ? "Password is required" : "";

  const performLogin = async (loginEmail: string, loginPass: string) => {
    setIsLoading(true);
    setError("");

    const result = await mockLogin(loginEmail, loginPass);

    if (result.success && result.redirectUrl) {
      if (result.role) {
        saveUserRole(result.role);
      }
      
      if (result.role === "admin" || result.role === "superadmin") {
        setShowPortalSelection(true);
        setIsLoading(false);
        return;
      }

      if (isExternalUrl(result.redirectUrl)) {
        window.location.href = result.redirectUrl;
      } else {
        router.push(result.redirectUrl);
      }
    } else if (result.success) {
      if (result.role) {
        saveUserRole(result.role);
      }
      router.push("/profile");
    } else {
      setError(result.error || "Login failed");
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    const emailErr = validateLogin(email);
    if (emailErr || !password) {
      setError(emailErr || "Password is required");
      return;
    }

    await performLogin(email, password);
  };

  if (showPortalSelection) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.standard, ease: SMOOTH_EASE }}
        className="flex flex-col gap-4"
      >
        <p className="mb-2 text-sm text-white/60">
          Please select the portal you want to access:
        </p>
        <PortalCard
          href={EXTERNAL_URLS.adminUI}
          title="AIM Admin UI"
          description="Content moderation and platform management"
        />
        <PortalCard
          href={EXTERNAL_URLS.coachPortal}
          title="AIM Coach Portal"
          description="Team, player, and mission management"
        />
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <FormInput
          label="Email"
          type="text"
          value={email}
          onChange={setEmail}
          onBlur={() => setTouched((t) => ({ ...t, email: true }))}
          error={emailError}
          placeholder="your@email.com"
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
          className="w-fit text-sm text-white/50 font-mono transition-colors duration-300 hover:text-[var(--color-brand)]"
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

/** Portal selection card for admin/superadmin users. */
function PortalCard({ href, title, description }: { href: string; title: string; description: string }) {
  return (
    <a
      href={href}
      className="group relative flex flex-col gap-2 rounded-xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:border-white/20 hover:bg-white/10"
    >
      <h3 className="text-xl uppercase tracking-wide text-white transition-colors duration-300 group-hover:text-[var(--color-brand)] font-anton">
        {title}
      </h3>
      <p className="text-sm text-white/50 font-mono">{description}</p>
    </a>
  );
}
