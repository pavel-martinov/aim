"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import FormInput from "@/components/ui/FormInput";
import OpaqueButton from "@/components/ui/OpaqueButton";
import GhostButton from "@/components/ui/GhostButton";
import SectionHeader from "../SectionHeader";
import ChildSelector from "./ChildSelector";
import AvatarUpload from "../AvatarUpload";
import { SMOOTH_EASE, DURATION } from "@/lib/animations";
import type { ParentUser, UpdateChildProfilePayload } from "@/types/user";

interface ParentAccountSectionProps {
  parent: ParentUser;
  selectedChildId: string;
  onSelectChild: (childId: string) => void;
  onSaveChild: (childId: string, updates: UpdateChildProfilePayload) => Promise<void>;
}

/**
 * Parent-managed child account section for profile basics and login identity.
 */
export default function ParentAccountSection({
  parent,
  selectedChildId,
  onSelectChild,
  onSaveChild,
}: ParentAccountSectionProps) {
  const selectedChild = parent.children.find((child) => child.id === selectedChildId);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>();
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [teamName, setTeamName] = useState("");
  const [academyName, setAcademyName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (!selectedChild || isEditing) return;

    setName(selectedChild.name);
    setAvatarUrl(selectedChild.avatarUrl);
    setDateOfBirth(selectedChild.dateOfBirth ?? "");
    setTeamName(selectedChild.teamName ?? "");
    setAcademyName(selectedChild.academy?.name ?? "");
    setEmail(selectedChild.account.email);
    setUsername(selectedChild.account.username);
  }, [selectedChild, isEditing]);

  if (!selectedChild) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-white/50 font-sans">No child account available to manage.</p>
      </div>
    );
  }

  const handleCancel = () => {
    setName(selectedChild.name);
    setAvatarUrl(selectedChild.avatarUrl);
    setDateOfBirth(selectedChild.dateOfBirth ?? "");
    setTeamName(selectedChild.teamName ?? "");
    setAcademyName(selectedChild.academy?.name ?? "");
    setEmail(selectedChild.account.email);
    setUsername(selectedChild.account.username);
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSaveChild(selectedChild.id, {
        name,
        avatarUrl,
        dateOfBirth: dateOfBirth || undefined,
        teamName: teamName || undefined,
        academyName: academyName || undefined,
        email,
        username,
      });
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <SectionHeader
        title="Account"
        subtitle="Manage your child's profile details and login identity"
        action={
          !isEditing ? (
            <GhostButton size="sm" onClick={() => setIsEditing(true)}>
              Edit
            </GhostButton>
          ) : undefined
        }
      />

      <ChildSelector
        children={parent.children}
        selectedId={selectedChildId}
        onSelect={(childId) => {
          setIsEditing(false);
          onSelectChild(childId);
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.standard, ease: SMOOTH_EASE, delay: 0.1 }}
        className="rounded-2xl border border-white/10 bg-white/[0.02] p-6"
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <AvatarUpload
              avatarUrl={avatarUrl}
              name={name || "Child"}
              onAvatarChange={(newAvatar) => {
                setAvatarUrl(newAvatar);
                setIsEditing(true);
              }}
            />
            <div className="flex-1">
              <h3 className="mb-4 text-xs uppercase tracking-widest text-white/40 font-mono">
                Child Profile
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormInput label="Full Name" value={name} onChange={setName} disabled={!isEditing} required />
                <FormInput
                  label="Date of Birth"
                  value={dateOfBirth}
                  onChange={setDateOfBirth}
                  disabled={!isEditing}
                  placeholder="YYYY-MM-DD"
                />
                <FormInput
                  label="Team"
                  value={teamName}
                  onChange={setTeamName}
                  disabled={!isEditing}
                  placeholder="Team name"
                />
                <FormInput
                  label="Academy"
                  value={academyName}
                  onChange={setAcademyName}
                  disabled={!isEditing}
                  placeholder="Academy name"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-xs uppercase tracking-widest text-white/40 font-mono">
              Login Identity
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormInput
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
                disabled={!isEditing}
                placeholder="Child email"
              />
              <FormInput
                label="Username"
                value={username}
                onChange={setUsername}
                disabled={!isEditing}
                placeholder="Username"
              />
            </div>
          </div>

          {isEditing && (
            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
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
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
