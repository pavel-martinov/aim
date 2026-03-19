"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { SMOOTH_EASE, DURATION } from "@/lib/animations";
import type { DrillProgress, MissionProgress, ChallengeProgress } from "@/types/user";

type Tab = "drills" | "missions" | "challenges";

interface RecentActivityProps {
  drills: DrillProgress[];
  missions: MissionProgress[];
  challenges: ChallengeProgress[];
}

/**
 * Tabbed component showing recent drills, missions, and challenges.
 */
export default function RecentActivity({ drills, missions, challenges }: RecentActivityProps) {
  const [activeTab, setActiveTab] = useState<Tab>("drills");

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "drills", label: "Drills", count: drills.length },
    { id: "missions", label: "Missions", count: missions.length },
    { id: "challenges", label: "Challenges", count: challenges.length },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.standard, ease: SMOOTH_EASE, delay: 0.1 }}
      className="rounded-2xl border border-white/10 bg-white/[0.02] p-6"
    >
      <h3 className="mb-4 text-xs uppercase tracking-widest text-white/40 font-mono">
        Recent Activity
      </h3>

      {/* Tabs */}
      <div className="mb-4 flex gap-2 border-b border-white/10 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "relative rounded-lg px-3 py-2 text-sm font-sans transition-colors",
              activeTab === tab.id
                ? "bg-[var(--color-brand)]/10 text-[var(--color-brand)]"
                : "text-white/50 hover:text-white"
            )}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className="ml-1.5 text-xs text-white/30">({tab.count})</span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: DURATION.fast, ease: SMOOTH_EASE }}
          className="flex flex-col gap-3"
        >
          {activeTab === "drills" && <DrillsList drills={drills} />}
          {activeTab === "missions" && <MissionsList missions={missions} />}
          {activeTab === "challenges" && <ChallengesList challenges={challenges} />}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

/** Displays a list of drill progress items. */
function DrillsList({ drills }: { drills: DrillProgress[] }) {
  if (drills.length === 0) {
    return <EmptyState message="No drills completed yet" />;
  }

  return (
    <>
      {drills.map((drill, index) => (
        <motion.div
          key={drill.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] p-3"
        >
          <div className="flex items-center gap-3">
            <ProgressCircle progress={drill.progress} size="sm" />
            <div>
              <p className="text-sm text-white font-sans">{drill.name}</p>
              <p className="text-xs text-white/40 font-mono capitalize">{drill.status.replace("_", " ")}</p>
            </div>
          </div>
          <StatusBadge status={drill.status} />
        </motion.div>
      ))}
    </>
  );
}

/** Displays a list of mission progress items. */
function MissionsList({ missions }: { missions: MissionProgress[] }) {
  if (missions.length === 0) {
    return <EmptyState message="No missions assigned yet" />;
  }

  return (
    <>
      {missions.map((mission, index) => (
        <motion.div
          key={mission.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] p-3"
        >
          <div className="flex items-center gap-3">
            <ProgressCircle progress={mission.progress} size="sm" />
            <div>
              <p className="text-sm text-white font-sans">{mission.title}</p>
              <p className="text-xs text-white/40 font-sans">by {mission.coachName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-white/50 font-mono">
            <span>🎯 {mission.drillsCompleted}/{mission.drillsTotal}</span>
            <span>💪 {mission.exercisesCompleted}/{mission.exercisesTotal}</span>
          </div>
        </motion.div>
      ))}
    </>
  );
}

/** Displays a list of challenge progress items. */
function ChallengesList({ challenges }: { challenges: ChallengeProgress[] }) {
  if (challenges.length === 0) {
    return <EmptyState message="No challenges yet" />;
  }

  return (
    <>
      {challenges.map((challenge, index) => (
        <motion.div
          key={challenge.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] p-3"
        >
          <div className="flex items-center gap-3">
            <ProgressCircle progress={challenge.progress} size="sm" />
            <div>
              <p className="text-sm text-white font-sans">{challenge.name}</p>
              <p className="text-xs text-white/40 font-sans">vs {challenge.opponentName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {challenge.rank && (
              <span className="rounded-full bg-[var(--color-brand)]/20 px-2 py-0.5 text-xs text-[var(--color-brand)] font-mono">
                #{challenge.rank}
              </span>
            )}
            <StatusBadge status={challenge.status} />
          </div>
        </motion.div>
      ))}
    </>
  );
}

/** Circular progress indicator. */
function ProgressCircle({ progress, size = "md" }: { progress: number; size?: "sm" | "md" }) {
  const dimensions = size === "sm" ? 36 : 48;
  const radius = size === "sm" ? 14 : 18;
  const strokeWidth = size === "sm" ? 2.5 : 3;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: dimensions, height: dimensions }}>
      <svg className="h-full w-full -rotate-90" viewBox={`0 0 ${dimensions} ${dimensions}`}>
        <circle
          cx={dimensions / 2}
          cy={dimensions / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={dimensions / 2}
          cy={dimensions / 2}
          r={radius}
          fill="none"
          stroke="var(--color-brand)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
      <span
        className={cn(
          "absolute inset-0 flex items-center justify-center font-medium text-white font-mono",
          size === "sm" ? "text-xs" : "text-sm"
        )}
      >
        {progress}%
      </span>
    </div>
  );
}

/** Status badge for drill/challenge status. */
function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string }> = {
    completed: { bg: "bg-green-500/20", text: "text-green-400" },
    in_progress: { bg: "bg-yellow-500/20", text: "text-yellow-400" },
    active: { bg: "bg-blue-500/20", text: "text-blue-400" },
    failed: { bg: "bg-red-500/20", text: "text-red-400" },
    expired: { bg: "bg-white/10", text: "text-white/40" },
  };

  const { bg, text } = config[status] ?? { bg: "bg-white/10", text: "text-white/50" };

  return (
    <span className={cn("rounded-full px-2 py-0.5 text-xs font-mono capitalize", bg, text)}>
      {status.replace("_", " ")}
    </span>
  );
}

/** Empty state message. */
function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center py-8">
      <p className="text-sm text-white/40 font-sans">{message}</p>
    </div>
  );
}
