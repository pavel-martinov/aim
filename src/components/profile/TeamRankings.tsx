"use client";

import { motion } from "framer-motion";
import AvatarFallback from "@/components/ui/AvatarFallback";
import { cn } from "@/lib/utils";
import { SMOOTH_EASE, DURATION } from "@/lib/animations";
import { DIVISION_CONFIG } from "@/lib/constants";
import type { TeamRanking } from "@/types/user";

interface TeamRankingsProps {
  rankings: TeamRanking[];
  teamName?: string;
}

/**
 * Leaderboard showing child's position within their team.
 */
export default function TeamRankings({ rankings, teamName }: TeamRankingsProps) {
  const topFive = rankings.slice(0, 5);
  const currentChild = rankings.find((r) => r.isCurrentChild);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.standard, ease: SMOOTH_EASE, delay: 0.3 }}
      className="rounded-2xl border border-white/10 bg-white/[0.02] p-6"
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-xs uppercase tracking-widest text-white/40 font-mono">
            Team Rankings
          </h3>
          {teamName && (
            <p className="mt-1 text-sm text-white/60 font-sans">{teamName}</p>
          )}
        </div>
        {currentChild && (
          <div className="rounded-full bg-[var(--color-brand)]/10 px-3 py-1">
            <span className="text-sm text-[var(--color-brand)] font-mono">
              #{currentChild.rank} of {rankings.length}
            </span>
          </div>
        )}
      </div>

      {rankings.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <p className="text-sm text-white/40 font-sans">No team rankings available</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {topFive.map((player, index) => (
            <RankingRow key={player.playerId} player={player} index={index} />
          ))}
          {rankings.length > 5 && (
            <button className="mt-2 text-center text-sm text-white/40 font-sans transition-colors hover:text-white">
              See All ({rankings.length} players)
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}

interface RankingRowProps {
  player: TeamRanking;
  index: number;
}

/** Individual player row in the leaderboard. */
function RankingRow({ player, index }: RankingRowProps) {
  const divisionConfig = DIVISION_CONFIG[player.division];

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        "flex items-center justify-between rounded-lg p-3 transition-all",
        player.isCurrentChild
          ? "border border-[var(--color-brand)]/30 bg-[var(--color-brand)]/5"
          : "border border-white/5 bg-white/[0.02]"
      )}
    >
      <div className="flex items-center gap-3">
        {/* Rank */}
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium font-mono",
            player.rank === 1 && "bg-yellow-500/20 text-yellow-400",
            player.rank === 2 && "bg-gray-400/20 text-gray-300",
            player.rank === 3 && "bg-orange-500/20 text-orange-400",
            player.rank > 3 && "bg-white/5 text-white/60"
          )}
        >
          {player.rank <= 3 ? <RankMedal rank={player.rank} /> : `#${player.rank}`}
        </div>

        {/* Avatar */}
        <AvatarFallback src={player.avatarUrl} name={player.playerName} size="sm" />

        {/* Info */}
        <div>
          <p
            className={cn(
              "text-sm font-medium font-sans",
              player.isCurrentChild ? "text-[var(--color-brand)]" : "text-white"
            )}
          >
            {player.playerName}
            {player.isCurrentChild && (
              <span className="ml-2 text-xs text-white/40">(Your child)</span>
            )}
          </p>
          <div className="flex items-center gap-2 text-xs text-white/40 font-mono">
            <span>LVL {player.level}</span>
            <span className="text-white/20">•</span>
            <span style={{ color: divisionConfig.color }}>{divisionConfig.label}</span>
          </div>
        </div>
      </div>

      {/* Score */}
      <div className="text-right">
        <p className="text-lg font-medium text-white font-mono">{player.score}%</p>
      </div>
    </motion.div>
  );
}

/** Medal icon for top 3 ranks. */
function RankMedal({ rank }: { rank: number }) {
  const colors: Record<number, string> = {
    1: "text-yellow-400",
    2: "text-gray-300",
    3: "text-orange-400",
  };

  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={colors[rank]}>
      <circle cx="8" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 10l-1 5 4-2 4 2-1-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
