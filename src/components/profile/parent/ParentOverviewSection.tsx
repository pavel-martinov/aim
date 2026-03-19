"use client";

import { motion, AnimatePresence } from "framer-motion";
import { SMOOTH_EASE, DURATION } from "@/lib/animations";
import type { ParentUser } from "@/types/user";
import SectionHeader from "../SectionHeader";
import ChildSelector from "./ChildSelector";
import PlayerStatsCard from "../PlayerStatsCard";
import ReportCard from "../ReportCard";
import RecentActivity from "../RecentActivity";
import AchievementsList from "../AchievementsList";
import TeamRankings from "../TeamRankings";

interface ParentOverviewSectionProps {
  parent: ParentUser;
  selectedChildId: string;
  onSelectChild: (childId: string) => void;
}

/**
 * Parent overview section with the child's latest progress and performance.
 */
export default function ParentOverviewSection({
  parent,
  selectedChildId,
  onSelectChild,
}: ParentOverviewSectionProps) {
  const selectedChild = parent.children.find((child) => child.id === selectedChildId);

  if (!selectedChild) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-white/50 font-sans">No children linked to this account.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <SectionHeader
        title="Overview"
        subtitle="Monitor your children's progress, achievements, and team standing"
      />

      <ChildSelector
        children={parent.children}
        selectedId={selectedChildId}
        onSelect={onSelectChild}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedChildId}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: DURATION.standard, ease: SMOOTH_EASE }}
          className="flex flex-col gap-8"
        >
          <PlayerStatsCard player={selectedChild} />
          <ReportCard reportCard={selectedChild.reportCard} />
          <RecentActivity
            drills={selectedChild.recentDrills}
            missions={selectedChild.recentMissions}
            challenges={selectedChild.recentChallenges}
          />
          <AchievementsList achievements={selectedChild.achievements} />
          {selectedChild.teamRankings.length > 0 && (
            <TeamRankings
              rankings={selectedChild.teamRankings}
              teamName={selectedChild.teamName}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
