"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FormInput from "@/components/ui/FormInput";
import OpaqueButton from "@/components/ui/OpaqueButton";
import Modal from "@/components/ui/Modal";
import GhostButton from "@/components/ui/GhostButton";
import SectionCard from "@/components/ui/SectionCard";
import SectionHeader from "@/components/profile/SectionHeader";
import { cn } from "@/lib/utils";
import { SMOOTH_EASE, DURATION } from "@/lib/animations";
import type { UpdatePasswordPayload, LoginActivity, ActiveSession } from "@/types/user";

interface SecuritySettingsProps {
  loginActivity: LoginActivity[];
  activeSessions: ActiveSession[];
  onPasswordChange: (payload: UpdatePasswordPayload) => Promise<{ success: boolean; error?: string }>;
  onEndSession: (sessionId: string) => Promise<void>;
  onEndAllSessions: () => Promise<void>;
}

const SUCCESS_MESSAGE_DURATION = 5000;

/**
 * Security settings section for password management, activity log, and session control.
 */
export default function SecuritySettings({
  loginActivity,
  activeSessions,
  onPasswordChange,
  onEndSession,
  onEndAllSessions,
}: SecuritySettingsProps) {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEndingAllSessions, setIsEndingAllSessions] = useState(false);
  const [showEndAllConfirm, setShowEndAllConfirm] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
    };
  }, []);

  const showSuccess = (msg: string) => {
    if (successTimerRef.current) clearTimeout(successTimerRef.current);
    setSuccessMessage(msg);
    successTimerRef.current = setTimeout(() => setSuccessMessage(""), SUCCESS_MESSAGE_DURATION);
  };

  const resetForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setErrorMessage("");
  };

  const handleSave = useCallback(async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorMessage("All fields are required");
      return;
    }
    if (newPassword.length < 8) {
      setErrorMessage("New password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage("New passwords do not match");
      return;
    }

    setIsSaving(true);
    try {
      const result = await onPasswordChange({ currentPassword, newPassword, confirmPassword });
      if (result.success) {
        showSuccess("Password updated successfully");
        resetForm();
        setIsChangingPassword(false);
      } else {
        setErrorMessage(result.error || "Failed to update password");
      }
    } finally {
      setIsSaving(false);
    }
  }, [currentPassword, newPassword, confirmPassword, onPasswordChange]);

  const handleEndAllSessions = async () => {
    setIsEndingAllSessions(true);
    try {
      await onEndAllSessions();
      setShowEndAllConfirm(false);
      showSuccess("All other sessions have been ended");
    } finally {
      setIsEndingAllSessions(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const diffMs = Date.now() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const otherSessions = activeSessions.filter((s) => !s.isCurrent);

  return (
    <div className="flex flex-col gap-8">
      <SectionHeader title="Security" subtitle="Manage your password and security settings" />

      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: DURATION.fast }}
            className="rounded-xl border border-[var(--color-brand)]/30 bg-[var(--color-brand)]/10 p-4"
          >
            <p className="text-sm text-[var(--color-brand)] font-sans">{successMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Password section */}
      <SectionCard>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xs uppercase tracking-widest text-white/40 font-mono">Password</h3>
            <p className="mt-2 text-white font-sans">••••••••••••</p>
            <p className="mt-1 text-xs text-white/40 font-sans">Last changed: Never</p>
          </div>
          {!isChangingPassword && (
            <GhostButton size="sm" onClick={() => setIsChangingPassword(true)}>
              Change
            </GhostButton>
          )}
        </div>

        <AnimatePresence>
          {isChangingPassword && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: DURATION.standard, ease: SMOOTH_EASE }}
              className="overflow-hidden"
            >
              <div className="mt-6 border-t border-white/10 pt-6">
                <div className="flex max-w-md flex-col gap-4">
                  <FormInput
                    label="Current Password"
                    type="password"
                    value={currentPassword}
                    onChange={setCurrentPassword}
                    placeholder="Enter current password"
                    autoComplete="current-password"
                  />
                  <FormInput
                    label="New Password"
                    type="password"
                    value={newPassword}
                    onChange={setNewPassword}
                    placeholder="Enter new password"
                    hint="Minimum 8 characters"
                    autoComplete="new-password"
                  />
                  <FormInput
                    label="Confirm New Password"
                    type="password"
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    placeholder="Confirm new password"
                    autoComplete="new-password"
                  />

                  {errorMessage && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm text-red-400 font-sans"
                    >
                      {errorMessage}
                    </motion.p>
                  )}

                  <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
                    <GhostButton onClick={() => { resetForm(); setIsChangingPassword(false); }} disabled={isSaving}>
                      Cancel
                    </GhostButton>
                    <OpaqueButton
                      variant="brand"
                      onClick={handleSave}
                      disabled={isSaving}
                      showIcon={false}
                      className="h-auto w-full py-3 sm:w-auto sm:px-6"
                    >
                      {isSaving ? "Updating..." : "Update Password"}
                    </OpaqueButton>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </SectionCard>

      {/* Active Sessions */}
      <SectionCard delay={0.1}>
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="text-xs uppercase tracking-widest text-white/40 font-mono">Active Sessions</h3>
            <p className="mt-1 text-xs text-white/40 font-sans">Devices where you&apos;re currently logged in</p>
          </div>
          {otherSessions.length > 0 && (
            <button
              onClick={() => setShowEndAllConfirm(true)}
              className="rounded-lg px-3 py-1.5 text-xs text-red-400 font-sans transition-colors hover:bg-red-400/10"
            >
              End All Other Sessions
            </button>
          )}
        </div>

        <div className="flex flex-col gap-3">
          {activeSessions.map((session) => (
            <div
              key={session.id}
              className={cn(
                "flex items-center justify-between rounded-xl border p-4",
                session.isCurrent
                  ? "border-[var(--color-brand)]/30 bg-[var(--color-brand)]/5"
                  : "border-white/10 bg-white/[0.02]"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                  <DeviceIcon device={session.device} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-white font-sans">{session.device}</p>
                    {session.isCurrent && (
                      <span className="rounded-full bg-[var(--color-brand)]/20 px-2 py-0.5 text-xs text-[var(--color-brand)]">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-white/40 font-sans">
                    {session.browser} • {session.location} • {formatTimestamp(session.lastActive)}
                  </p>
                </div>
              </div>

              {!session.isCurrent && (
                <button
                  onClick={() => onEndSession(session.id)}
                  className="rounded-lg p-2 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="End session"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Login Activity */}
      <SectionCard delay={0.15}>
        <h3 className="mb-4 text-xs uppercase tracking-widest text-white/40 font-mono">
          Recent Login Activity
        </h3>
        <div className="flex flex-col gap-3">
          {loginActivity.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0 last:pb-0"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
                  <DeviceIcon device={activity.device} className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-white font-sans">{activity.device}</p>
                    {activity.isCurrent && (
                      <span className="text-xs text-[var(--color-brand)]">Current</span>
                    )}
                  </div>
                  <p className="text-xs text-white/40 font-sans">
                    {activity.browser} • {activity.location}
                  </p>
                </div>
              </div>
              <p className="text-xs text-white/40 font-mono">{formatTimestamp(activity.timestamp)}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Security Tips */}
      <SectionCard delay={0.2}>
        <h3 className="mb-4 text-xs uppercase tracking-widest text-white/40 font-mono">Security Tips</h3>
        <ul className="flex flex-col gap-2 text-sm text-white/60">
          {[
            "Use a unique password you don't use elsewhere",
            "Review your login activity regularly",
            "End sessions on devices you no longer use",
          ].map((tip) => (
            <li key={tip} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-brand)]" />
              <span className="font-sans">{tip}</span>
            </li>
          ))}
        </ul>
      </SectionCard>

      <Modal isOpen={showEndAllConfirm} onClose={() => setShowEndAllConfirm(false)}>
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-400/10">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-red-400">
            <path
              d="M12 9v4M12 17h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="text-xl text-white font-sans">End All Other Sessions?</h2>
        <p className="mt-2 text-sm text-white/60 font-sans">
          This will log you out of all devices except this one. You&apos;ll need to sign in again on those devices.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <GhostButton onClick={() => setShowEndAllConfirm(false)} disabled={isEndingAllSessions}>
            Cancel
          </GhostButton>
          <button
            onClick={handleEndAllSessions}
            disabled={isEndingAllSessions}
            className="rounded-xl bg-red-500/10 px-6 py-3 text-sm text-red-400 font-sans transition-all duration-300 hover:bg-red-500/20 disabled:opacity-50"
          >
            {isEndingAllSessions ? "Ending..." : "End All Sessions"}
          </button>
        </div>
      </Modal>
    </div>
  );
}

function DeviceIcon({ device, className = "h-5 w-5" }: { device: string; className?: string }) {
  const lowerDevice = device.toLowerCase();

  if (lowerDevice.includes("iphone") || lowerDevice.includes("android")) {
    return (
      <svg className={cn("text-white/60", className)} viewBox="0 0 20 20" fill="none">
        <rect x="5" y="2" width="10" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="10" cy="15" r="1" fill="currentColor" />
      </svg>
    );
  }

  if (lowerDevice.includes("ipad") || lowerDevice.includes("tablet")) {
    return (
      <svg className={cn("text-white/60", className)} viewBox="0 0 20 20" fill="none">
        <rect x="3" y="3" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="10" cy="14" r="1" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg className={cn("text-white/60", className)} viewBox="0 0 20 20" fill="none">
      <rect x="2" y="4" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 17h8M10 14v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
