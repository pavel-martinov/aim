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
import { redirectToDownloadStore } from "@/lib/download";
import { SMOOTH_EASE, DURATION } from "@/lib/animations";

const COACH_PORTAL_URL = "https://coach-portal-ui.aim-football.com/login";

/**
 * V1 login chooser that sends users to the correct destination without in-site auth.
 */
export default function LoginForm() {
  const [isRedirecting, setIsRedirecting] = useState<"player" | "coach" | null>(null);

  const handlePlayerSelect = () => {
    setIsRedirecting("player");
    redirectToDownloadStore();
  };

  const handleCoachSelect = () => {
    setIsRedirecting("coach");
    window.location.assign(COACH_PORTAL_URL);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.standard, ease: SMOOTH_EASE }}
      className="flex flex-col gap-5"
    >
      <OpaqueButton
        type="button"
        variant="dark"
        className={`lg:!w-full ${
          isRedirecting === "player"
            ? "bg-[var(--color-brand)] text-black hover:bg-[var(--color-brand)] hover:text-black hover:brightness-110"
            : "bg-white/[0.12] text-white hover:bg-white/[0.18] hover:text-white"
        }`}
        disabled={isRedirecting !== null}
        onClick={handlePlayerSelect}
      >
        {isRedirecting === "player" ? "Redirecting Player..." : "I'm a Player"}
      </OpaqueButton>

      <OpaqueButton
        type="button"
        variant="dark"
        className={`lg:!w-full ${
          isRedirecting === "coach"
            ? "bg-[var(--color-brand)] text-black hover:bg-[var(--color-brand)] hover:text-black hover:brightness-110"
            : "bg-white/[0.12] text-white hover:bg-white/[0.18] hover:text-white"
        }`}
        disabled={isRedirecting !== null}
        onClick={handleCoachSelect}
      >
        {isRedirecting === "coach" ? "Redirecting Coach..." : "I'm a Coach"}
      </OpaqueButton>
    </motion.div>
  );
}

/**
 * Legacy persona-based login flow preserved for post-V1 reuse.
 * Hidden from the current UI, but kept in code for later handoff.
 */
function LegacyLoginForm() {
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
        <LegacyPortalCard
          href={EXTERNAL_URLS.adminUI}
          title="AIM Admin UI"
          description="Content moderation and platform management"
        />
        <LegacyPortalCard
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

/** Legacy portal card kept with the hidden persona auth flow. */
function LegacyPortalCard({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <a
      href={href}
      className="group relative flex flex-col gap-2 rounded-xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:border-white/20 hover:bg-white/10"
    >
      <h3 className="font-anton text-xl uppercase tracking-wide text-white transition-colors duration-300 group-hover:text-[var(--color-brand)]">
        {title}
      </h3>
      <p className="font-mono text-sm text-white/50">{description}</p>
    </a>
  );
}
