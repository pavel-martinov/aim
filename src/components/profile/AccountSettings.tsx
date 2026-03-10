"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import FormInput from "@/components/ui/FormInput";
import FormSelect from "@/components/ui/FormSelect";
import OpaqueButton from "@/components/ui/OpaqueButton";
import GhostButton from "@/components/ui/GhostButton";
import SectionHeader from "@/components/profile/SectionHeader";
import { SMOOTH_EASE, DURATION } from "@/lib/animations";
import { FOOTBALL_POSITIONS, COUNTRIES } from "@/lib/mockUser";
import type { User, UpdateUserPayload, Gender } from "@/types/user";

interface AccountSettingsProps {
  user: User;
  onSave: (updates: UpdateUserPayload) => Promise<void>;
}

const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

/**
 * Account settings form for editing personal details.
 */
export default function AccountSettings({ user, onSave }: AccountSettingsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone || "");
  const [dateOfBirth, setDateOfBirth] = useState(user.dateOfBirth || "");
  const [country, setCountry] = useState(user.country || "");
  const [gender, setGender] = useState<string>(user.gender || "");
  const [preferredPosition, setPreferredPosition] = useState(user.preferredPosition || "");

  // Sync form state if the user prop is updated externally (e.g. after API save).
  useEffect(() => {
    if (!isEditing) {
      setName(user.name);
      setPhone(user.phone || "");
      setDateOfBirth(user.dateOfBirth || "");
      setCountry(user.country || "");
      setGender(user.gender || "");
      setPreferredPosition(user.preferredPosition || "");
    }
  }, [user, isEditing]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      await onSave({
        name,
        phone: phone || undefined,
        dateOfBirth: dateOfBirth || undefined,
        country: country || undefined,
        gender: (gender as Gender) || undefined,
        preferredPosition: preferredPosition || undefined,
      });
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  }, [name, phone, dateOfBirth, country, gender, preferredPosition, onSave]);

  const handleCancel = () => {
    setName(user.name);
    setPhone(user.phone || "");
    setDateOfBirth(user.dateOfBirth || "");
    setCountry(user.country || "");
    setGender(user.gender || "");
    setPreferredPosition(user.preferredPosition || "");
    setIsEditing(false);
  };

  const positionOptions = FOOTBALL_POSITIONS.map((pos) => ({ value: pos, label: pos }));
  const countryOptions = COUNTRIES.map((c) => ({ value: c, label: c }));

  return (
    <div className="flex flex-col gap-8">
      <SectionHeader
        title="Account"
        subtitle="Update your personal information"
        action={
          !isEditing ? (
            <GhostButton size="sm" onClick={() => setIsEditing(true)}>
              Edit
            </GhostButton>
          ) : undefined
        }
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.standard, ease: SMOOTH_EASE }}
        className="rounded-2xl border border-white/10 bg-white/[0.02] p-6"
      >
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="mb-4 text-xs uppercase tracking-widest text-white/40 font-mono">
              Basic Information
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormInput label="Full Name" value={name} onChange={setName} disabled={!isEditing} required />
              <FormInput
                label="Email"
                value={user.email}
                onChange={() => {}}
                disabled
                hint="Contact support to change email"
              />
              <FormInput
                label="Phone Number"
                type="tel"
                value={phone}
                onChange={setPhone}
                disabled={!isEditing}
                placeholder="+1 555 123 4567"
              />
              <FormInput
                label="Date of Birth"
                type="text"
                value={dateOfBirth}
                onChange={setDateOfBirth}
                disabled={!isEditing}
                placeholder="YYYY-MM-DD"
              />
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-xs uppercase tracking-widest text-white/40 font-mono">
              Personal Details
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormSelect
                label="Country"
                value={country}
                onChange={setCountry}
                options={countryOptions}
                disabled={!isEditing}
                placeholder="Select country"
              />
              <FormSelect
                label="Gender"
                value={gender}
                onChange={setGender}
                options={GENDER_OPTIONS}
                disabled={!isEditing}
                placeholder="Select gender"
              />
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-xs uppercase tracking-widest text-white/40 font-mono">
              Player Information
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormSelect
                label="Preferred Position"
                value={preferredPosition}
                onChange={setPreferredPosition}
                options={positionOptions}
                disabled={!isEditing}
                placeholder="Select position"
              />
            </div>
          </div>

          {isEditing && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: DURATION.fast }}
              className="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-end"
            >
              <GhostButton onClick={handleCancel} disabled={isSaving}>
                Cancel
              </GhostButton>
              <OpaqueButton
                variant="brand"
                onClick={handleSave}
                disabled={isSaving}
                showIcon={false}
                className="h-auto w-full py-3 sm:w-auto sm:px-6"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </OpaqueButton>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
