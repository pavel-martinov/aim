"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FormInput from "@/components/ui/FormInput";
import OpaqueButton from "@/components/ui/OpaqueButton";
import GhostButton from "@/components/ui/GhostButton";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import SectionHeader from "../SectionHeader";
import ChildSelector from "./ChildSelector";
import ParentalControlsPanel from "./ParentalControlsPanel";
import { SMOOTH_EASE, DURATION } from "@/lib/animations";
import type {
  ParentUser,
  ParentalControls,
  SetChildPasswordPayload,
  UpdateChildProfilePayload,
} from "@/types/user";

interface ParentSecuritySectionProps {
  parent: ParentUser;
  selectedChildId: string;
  onSelectChild: (childId: string) => void;
  onUpdateControls: (childId: string, controls: Partial<ParentalControls>) => Promise<void>;
  onUpdateChild: (childId: string, updates: UpdateChildProfilePayload) => Promise<void>;
  onSetPassword: (
    childId: string,
    payload: SetChildPasswordPayload
  ) => Promise<{ success: boolean; error?: string }>;
}

/**
 * Parent security section for child access, passwords, and parental controls.
 */
export default function ParentSecuritySection({
  parent,
  selectedChildId,
  onSelectChild,
  onUpdateControls,
  onUpdateChild,
  onSetPassword,
}: ParentSecuritySectionProps) {
  const selectedChild = parent.children.find((child) => child.id === selectedChildId);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isTogglingAccess, setIsTogglingAccess] = useState(false);

  useEffect(() => {
    setNewPassword("");
    setConfirmPassword("");
    setErrorMessage("");
    setSuccessMessage("");
  }, [selectedChildId]);

  if (!selectedChild) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-white/50 font-sans">No child security settings available.</p>
      </div>
    );
  }

  const handlePasswordSave = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    setIsSavingPassword(true);

    try {
      const result = await onSetPassword(selectedChild.id, {
        newPassword,
        confirmPassword,
      });

      if (!result.success) {
        setErrorMessage(result.error ?? "Unable to update password");
        return;
      }

      setNewPassword("");
      setConfirmPassword("");
      setSuccessMessage("Child password updated successfully");
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleAccessToggle = async () => {
    setIsTogglingAccess(true);
    try {
      await onUpdateChild(selectedChild.id, {
        canLogin: !selectedChild.account.canLogin,
      });
    } finally {
      setIsTogglingAccess(false);
    }
  };

  const passwordUpdatedLabel = selectedChild.account.passwordLastUpdatedAt
    ? new Date(selectedChild.account.passwordLastUpdatedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Never";

  const hasInput = newPassword.length > 0 || confirmPassword.length > 0;
  const isUpdateDisabled = isSavingPassword || !hasInput;

  return (
    <div className="flex flex-col gap-8">
      <SectionHeader
        title="Security"
        subtitle="Control your child's access, password, and parental permissions"
      />

      <ChildSelector
        children={parent.children}
        selectedId={selectedChildId}
        onSelect={onSelectChild}
      />

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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.standard, ease: SMOOTH_EASE }}
        className="rounded-2xl border border-white/10 bg-white/[0.02] p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xs uppercase tracking-widest text-white/40 font-mono">
              Child Access
            </h3>
            <p className="mt-2 text-white font-sans">Username: {selectedChild.account.username}</p>
            <p className="mt-1 text-xs text-white/40 font-sans">
              Login is currently {selectedChild.account.canLogin ? "enabled" : "disabled"} for this child.
            </p>
          </div>
          <ToggleSwitch
            enabled={selectedChild.account.canLogin}
            loading={isTogglingAccess}
            onChange={handleAccessToggle}
            ariaLabel={selectedChild.account.canLogin ? "Disable child login" : "Enable child login"}
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.standard, ease: SMOOTH_EASE, delay: 0.1 }}
        className="rounded-2xl border border-white/10 bg-white/[0.02] p-6"
      >
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="text-xs uppercase tracking-widest text-white/40 font-mono">
              Password Setup
            </h3>
            <p className="mt-2 text-sm text-white/60 font-sans">
              Parents can set or reset the child's password without the current password.
            </p>
            <p className="mt-1 text-xs text-white/40 font-sans">
              Last updated: {passwordUpdatedLabel}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput
              label="New Password"
              type="password"
              value={newPassword}
              onChange={setNewPassword}
              placeholder="Minimum 8 characters"
              autoComplete="new-password"
            />
            <FormInput
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="Confirm password"
              autoComplete="new-password"
            />
          </div>

          {errorMessage && <p className="text-sm text-red-400 font-sans">{errorMessage}</p>}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            {hasInput && (
              <GhostButton
                onClick={() => {
                  setNewPassword("");
                  setConfirmPassword("");
                  setErrorMessage("");
                }}
                disabled={isSavingPassword}
              >
                Clear
              </GhostButton>
            )}
            <OpaqueButton
              variant="brand"
              onClick={handlePasswordSave}
              disabled={isUpdateDisabled}
              showIcon={false}
              className="h-auto w-full py-3 sm:w-auto sm:px-6"
            >
              {isSavingPassword ? "Updating..." : "Update Password"}
            </OpaqueButton>
          </div>
        </div>
      </motion.div>

      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-xs uppercase tracking-widest text-white/40 font-mono">
            Parental Controls
          </h3>
          <p className="mt-2 text-sm text-white/60 font-sans">
            Decide which communication and competition features your child can access.
          </p>
        </div>
        <ParentalControlsPanel
          controls={selectedChild.controls}
          onUpdate={(controls) => onUpdateControls(selectedChild.id, controls)}
        />
      </div>
    </div>
  );
}
