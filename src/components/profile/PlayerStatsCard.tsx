"use client";

import { motion } from "framer-motion";
import AvatarFallback from "@/components/ui/AvatarFallback";
import { SMOOTH_EASE, DURATION } from "@/lib/animations";
import { DIVISION_CONFIG } from "@/lib/constants";
import type { ChildProfile, User } from "@/types/user";

interface PlayerStatsCardProps {
  player: Pick<User | ChildProfile, "name" | "avatarUrl" | "level" | "division" | "totalScore" | "stats" | "academy">;
  showIdentity?: boolean;
}

/**
 * Player card style component showing level, division, score and stats.
 */
export default function PlayerStatsCard({ player, showIdentity = true }: PlayerStatsCardProps) {
  const divisionConfig = DIVISION_CONFIG[player.division];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.standard, ease: SMOOTH_EASE }}
      className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-6"
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        {showIdentity && (
          <div className="flex flex-col items-center gap-4 sm:items-start">
            <AvatarFallback
              src={player.avatarUrl}
              name={player.name}
              size="xl"
              className="rounded-xl shadow-lg"
              borderClassName="border-2 border-white/20"
            />

            <div className="text-center sm:text-left">
              <h3 className="text-lg font-medium text-white font-sans">{player.name}</h3>
              {player.academy && (
                <p className="mt-1 text-xs text-white/50 font-sans">{player.academy.name}</p>
              )}
            </div>
          </div>
        )}

        {/* Right: Stats Grid */}
        <div className="flex flex-1 flex-col gap-4">
          {/* Top Stats Row */}
          <div className="grid grid-cols-3 gap-4">
            <StatBox label="Level" value={(player.level || 0).toString()} prefix="LVL" />
            <StatBox label="Score" value={(player.totalScore || 0).toString()} />
            <StatBox
              label="Division"
              value={divisionConfig.label}
              valueColor={divisionConfig.color}
            />
          </div>

          {/* Performance Stats */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <p className="mb-3 text-xs uppercase tracking-widest text-white/40 font-mono">
              Performance Stats
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <PerformanceStat label="PAC" value={player.stats?.pace || 0} />
              <PerformanceStat label="PAS" value={player.stats?.passing || 0} />
              <PerformanceStat label="DRI" value={player.stats?.dribbling || 0} />
              <PerformanceStat label="CTR" value={player.stats?.control || 0} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/** Small stat box for level, score, division. */
function StatBox({
  label,
  value,
  prefix,
  valueColor,
}: {
  label: string;
  value: string;
  prefix?: string;
  valueColor?: string;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3 text-center">
      <p className="text-xs uppercase tracking-widest text-white/40 font-mono">{label}</p>
      <p
        className="mt-1 text-xl font-medium font-sans"
        style={{ color: valueColor ?? "white" }}
      >
        {prefix && <span className="text-sm text-white/60">{prefix} </span>}
        {value}
      </p>
    </div>
  );
}

/** Individual performance stat with circular progress indicator. */
function PerformanceStat({ label, value }: { label: string; value: number }) {
  const normalizedValue = Math.min(100, Math.max(0, value));
  const circumference = 2 * Math.PI * 18;
  const strokeDashoffset = circumference - (normalizedValue / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-12 w-12">
        {/* Background circle */}
        <svg className="h-full w-full -rotate-90" viewBox="0 0 40 40">
          <circle
            cx="20"
            cy="20"
            r="18"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="3"
          />
          <motion.circle
            cx="20"
            cy="20"
            r="18"
            fill="none"
            stroke="var(--color-brand)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: DURATION.hero, ease: SMOOTH_EASE, delay: 0.2 }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-medium text-white font-mono">
          {value}
        </span>
      </div>
      <p className="text-xs text-white/50 font-mono">{label}</p>
    </div>
  );
}
