"use client";

import { motion } from "framer-motion";
import CheckIcon from "@/components/ui/CheckIcon";
import { cn } from "@/lib/utils";
import { SMOOTH_EASE, DURATION } from "@/lib/animations";
import type { Achievement } from "@/types/user";

interface AchievementsListProps {
  achievements: Achievement[];
}

/**
 * Horizontal scrollable list of achievement badges.
 */
export default function AchievementsList({ achievements }: AchievementsListProps) {
  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.standard, ease: SMOOTH_EASE, delay: 0.2 }}
      className="rounded-2xl border border-white/10 bg-white/[0.02] p-6"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xs uppercase tracking-widest text-white/40 font-mono">
          Achievements
        </h3>
        <span className="text-xs text-white/40 font-mono">
          {unlockedCount}/{achievements.length} unlocked
        </span>
      </div>

      {achievements.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <p className="text-sm text-white/40 font-sans">No achievements yet</p>
        </div>
      ) : (
        <div className="relative -mx-2 px-2">
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {achievements.map((achievement, index) => (
              <AchievementBadge key={achievement.id} achievement={achievement} index={index} />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

interface AchievementBadgeProps {
  achievement: Achievement;
  index: number;
}

/** Individual achievement badge with icon and name. */
function AchievementBadge({ achievement, index }: AchievementBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: DURATION.standard, ease: SMOOTH_EASE, delay: index * 0.1 }}
      className={cn(
        "flex shrink-0 flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all",
        achievement.isUnlocked
          ? "border-white/10 bg-white/[0.02]"
          : "border-white/5 bg-white/[0.01] opacity-50"
      )}
      style={{ width: 100 }}
    >
      {/* Badge Icon */}
      <div
        className={cn(
          "relative flex h-14 w-14 items-center justify-center rounded-xl",
          achievement.isUnlocked
            ? "bg-gradient-to-br from-[var(--color-brand)]/20 to-[var(--color-brand)]/5"
            : "bg-white/5"
        )}
      >
        <AchievementIcon type={achievement.name} isUnlocked={achievement.isUnlocked} />
        {achievement.isUnlocked && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 400 }}
            className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-brand)]"
          >
            <CheckIcon />
          </motion.div>
        )}
      </div>

      {/* Badge Name */}
      <p
        className={cn(
          "text-xs font-medium font-sans line-clamp-2",
          achievement.isUnlocked ? "text-white" : "text-white/40"
        )}
      >
        {achievement.name}
      </p>
    </motion.div>
  );
}

/** Achievement icon based on type. */
function AchievementIcon({ type, isUnlocked }: { type: string; isUnlocked: boolean }) {
  const iconColor = isUnlocked ? "text-[var(--color-brand)]" : "text-white/30";

  if (type.includes("Ladder") || type.includes("Climbing")) {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className={iconColor}>
        <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type.includes("Record") || type.includes("Personal")) {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className={iconColor}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type.includes("Coach") || type.includes("Approved")) {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className={iconColor}>
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type.includes("Team")) {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className={iconColor}>
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  // Default trophy icon
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className={iconColor}>
      <path d="M6 9H4.5a2.5 2.5 0 010-5H6M18 9h1.5a2.5 2.5 0 000-5H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 4h16v5a6 6 0 01-6 6h-4a6 6 0 01-6-6V4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 15v3M8 21h8M9 18h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
