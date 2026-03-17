"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import { SMOOTH_EASE, DURATION } from "@/lib/animations";
import { openDownloadStore } from "@/lib/download";
import type { ParentalControls } from "@/types/user";

interface ParentalControlsPanelProps {
  controls: ParentalControls;
  onUpdate: (controls: Partial<ParentalControls>) => Promise<void>;
}

/**
 * Panel for managing parental control settings.
 */
export default function ParentalControlsPanel({
  controls,
  onUpdate,
}: ParentalControlsPanelProps) {
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const handleToggle = async (key: keyof ParentalControls) => {
    setIsUpdating(key);
    try {
      await onUpdate({ [key]: !controls[key] });
    } finally {
      setIsUpdating(null);
    }
  };

  const controlItems: {
    key: keyof ParentalControls;
    label: string;
    description: string;
    icon: React.ReactNode;
  }[] = [
    {
      key: "chatEnabled",
      label: "Chat",
      description: "Allow your child to chat with coaches and teammates",
      icon: <ChatIcon />,
    },
    {
      key: "notificationsEnabled",
      label: "Notifications",
      description: "Allow push notifications for drills and challenges",
      icon: <BellIcon />,
    },
    {
      key: "challengesEnabled",
      label: "Challenges",
      description: "Allow your child to participate in challenges",
      icon: <TrophyIcon />,
    },
    {
      key: "leaderboardVisible",
      label: "Leaderboard",
      description: "Show your child's position in team rankings",
      icon: <ChartIcon />,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: DURATION.standard, ease: SMOOTH_EASE }}
      className="overflow-hidden"
    >
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <div className="flex flex-col gap-4">
          {controlItems.map((item) => (
            <ControlToggle
              key={item.key}
              label={item.label}
              description={item.description}
              icon={item.icon}
              isEnabled={controls[item.key]}
              isLoading={isUpdating === item.key}
              onToggle={() => handleToggle(item.key)}
            />
          ))}
        </div>

        {/* Download App Link */}
        <div className="mt-6 border-t border-white/10 pt-4">
          <button
            onClick={openDownloadStore}
            className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] p-4 transition-all hover:border-white/20 hover:bg-white/[0.04]"
          >
            <div className="flex items-center gap-3">
              <DownloadIcon />
              <div className="text-left">
                <p className="text-sm font-medium text-white font-sans">Download AIM App</p>
                <p className="text-xs text-white/50 font-sans">
                  Available on iOS and Android
                </p>
              </div>
            </div>
            <ArrowRightIcon />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

interface ControlToggleProps {
  label: string;
  description: string;
  icon: React.ReactNode;
  isEnabled: boolean;
  isLoading: boolean;
  onToggle: () => void;
}

/** Individual toggle control item. */
function ControlToggle({
  label,
  description,
  icon,
  isEnabled,
  isLoading,
  onToggle,
}: ControlToggleProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-white font-sans">{label}</p>
          <p className="text-xs text-white/40 font-sans">{description}</p>
        </div>
      </div>
      <ToggleSwitch
        enabled={isEnabled}
        loading={isLoading}
        onChange={onToggle}
        ariaLabel={`${label} ${isEnabled ? "enabled" : "disabled"}`}
      />
    </div>
  );
}

function ChatIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-white/60">
      <path d="M17 9.5a6.5 6.5 0 01-9.33 5.86L3 17l1.64-4.67A6.5 6.5 0 1117 9.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-white/60">
      <path d="M15 6.667a5 5 0 00-10 0c0 5.833-2.5 7.5-2.5 7.5h15S15 12.5 15 6.667M11.442 16.667a1.667 1.667 0 01-2.884 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrophyIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-white/60">
      <path d="M5 7.5H3.75a2.083 2.083 0 010-4.167H5M15 7.5h1.25a2.083 2.083 0 000-4.167H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.333 3.333h13.334v4.167a5 5 0 01-5 5h-3.334a5 5 0 01-5-5V3.333z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 12.5v2.5M6.667 17.5h6.666M7.5 15h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-white/60">
      <path d="M15 17.5V8.333M10 17.5V2.5M5 17.5v-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-white/60">
      <path d="M17.5 12.5v3.333a1.667 1.667 0 01-1.667 1.667H4.167A1.667 1.667 0 012.5 15.833V12.5M5.833 8.333L10 12.5l4.167-4.167M10 12.5v-10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-white/40">
      <path d="M7.5 15l5-5-5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
