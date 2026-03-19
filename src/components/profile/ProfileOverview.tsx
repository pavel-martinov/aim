"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SMOOTH_EASE, DURATION } from "@/lib/animations";
import { PLAN_PRICING } from "@/lib/mockUser";
import type { User, ProfileSection } from "@/types/user";
import AvatarUpload from "./AvatarUpload";
import SectionHeader from "./SectionHeader";
import GhostButton from "@/components/ui/GhostButton";
import PlayerStatsCard from "./PlayerStatsCard";
import ReportCard from "./ReportCard";
import RecentActivity from "./RecentActivity";
import AchievementsList from "./AchievementsList";
import TeamRankings from "./TeamRankings";

interface ProfileOverviewProps {
  user: User;
  onAvatarChange: (avatarUrl: string) => void;
  onEditProfile: () => void;
  onSectionChange: (section: ProfileSection) => void;
}

/**
 * Profile overview section showing avatar, name, email and player details.
 */
export default function ProfileOverview({
  user,
  onAvatarChange,
  onEditProfile,
  onSectionChange,
}: ProfileOverviewProps) {
  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  const planName = PLAN_PRICING[user.subscription.tier].name;

  return (
    <div className="flex flex-col gap-8">
      <SectionHeader title="Overview" subtitle="Manage your account settings and preferences" />

      {/* Profile card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.standard, ease: SMOOTH_EASE }}
        className="rounded-2xl border border-white/10 bg-white/[0.02] p-6"
      >
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <AvatarUpload avatarUrl={user.avatarUrl} name={user.name} onAvatarChange={onAvatarChange} />

          <div className="flex flex-1 flex-col items-center gap-4 sm:items-start">
            <div className="text-center sm:text-left">
              <h2 className="text-xl text-white font-sans md:text-2xl">{user.name}</h2>
              <p className="mt-1 text-sm text-white/50 font-mono">{user.email}</p>
            </div>
            <GhostButton size="sm" onClick={onEditProfile} className="mt-2">
              Edit Profile
            </GhostButton>
          </div>
        </div>
      </motion.div>

      {/* Quick stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Member Since" value={memberSince} />
        <StatCard
          label="Current Plan"
          value={planName}
          onClick={() => onSectionChange("billing")}
          showArrow
        />
        <StatCard
          label="Status"
          value={user.subscription.status === "active" ? "Active" : "Inactive"}
        />
      </div>

      {/* Player Stats */}
      <PlayerStatsCard player={user} showIdentity={false} />

      {/* Report Card */}
      {user.reportCard && <ReportCard reportCard={user.reportCard} />}

      {/* Recent Activity */}
      {user.recentDrills && user.recentMissions && user.recentChallenges && (
        <RecentActivity
          drills={user.recentDrills}
          missions={user.recentMissions}
          challenges={user.recentChallenges}
        />
      )}

      {/* Achievements */}
      {user.achievements && <AchievementsList achievements={user.achievements} />}

      {/* Team Rankings */}
      {user.teamRankings && user.teamRankings.length > 0 && (
        <TeamRankings rankings={user.teamRankings} teamName={user.teamName} />
      )}
    </div>
  );
}

/** Small stats card for profile overview metrics. */
function StatCard({
  label,
  value,
  onClick,
  showArrow = false,
}: {
  label: string;
  value: string;
  onClick?: () => void;
  showArrow?: boolean;
}) {
  const Component = onClick ? "button" : "div";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.standard, ease: SMOOTH_EASE }}
    >
      <Component
        onClick={onClick}
        className={cn(
          "flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-4 text-left",
          onClick && "cursor-pointer transition-all duration-300 hover:border-white/20 hover:bg-white/[0.04]"
        )}
      >
        <div>
          <p className="text-xs uppercase tracking-widest text-white/40 font-mono">{label}</p>
          <p className="mt-1 text-lg text-white font-sans">{value}</p>
        </div>
        {showArrow && (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-white/40">
            <path
              d="M7 4l6 6-6 6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </Component>
    </motion.div>
  );
}
