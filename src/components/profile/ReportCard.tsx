"use client";

import { motion } from "framer-motion";
import { SMOOTH_EASE, DURATION } from "@/lib/animations";
import type { ChildProfile, User } from "@/types/user";

interface ReportCardProps {
  reportCard?: ChildProfile["reportCard"] | User["reportCard"];
}

/**
 * Report card component displaying summary, metrics, and coach assessment.
 */
export default function ReportCard({ reportCard }: ReportCardProps) {
  if (!reportCard) return null;

  const { summary, assessment } = reportCard;

  return (
    <div className="flex flex-col gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.standard, ease: SMOOTH_EASE }}
        className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-6"
      >
        <div className="border-b border-white/10 pb-4">
          <h3 className="text-sm font-medium text-white font-sans">Summary</h3>
          <p className="mt-2 text-sm text-white/70 font-sans leading-relaxed">
            {summary.summaryText}
          </p>
        </div>

        {/* Key Performance Metrics */}
        <div className="mt-2 rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <div className="mb-4">
            <h4 className="text-sm font-medium text-white font-sans">Key Performance Metrics</h4>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xl font-medium text-white font-sans">{summary.totalDrills}</p>
              <p className="text-xs text-white/50 font-sans">Total Drills</p>
            </div>
            <div>
              <p className="text-xl font-medium text-[var(--color-brand)] font-sans">{summary.averageScore}%</p>
              <p className="text-xs text-white/50 font-sans">Average Score</p>
            </div>
            <div>
              <p className="text-xl font-medium text-orange-400 font-sans">{summary.bestScore}%</p>
              <p className="text-xs text-white/50 font-sans">Best Score</p>
            </div>
          </div>
        </div>

        {/* Key Strengths */}
        {summary.keyStrengths && summary.keyStrengths.length > 0 && (
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <div className="mb-3">
              <h4 className="text-sm font-medium text-white font-sans">Key Strengths</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {summary.keyStrengths.map((strength, idx) => (
                <span key={idx} className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/80 font-sans">
                  {strength}
                </span>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Coach Assessment */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.standard, ease: SMOOTH_EASE, delay: 0.1 }}
        className="flex flex-col gap-6 rounded-2xl border border-white/10 bg-white/[0.02] p-6"
      >
        <div>
          <h3 className="text-sm font-medium text-white font-sans">Coach Assessment</h3>
          <p className="mt-1 text-xs text-white/50 font-sans">Ratings provided by the coach on a scale of 0-10</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <RatingSlider label="Attitude" value={assessment.attitude} description="Player's general demeanor and mindset" />
          <RatingSlider label="Team Play" value={assessment.teamPlay} description="Ability to work with teammates" />
          <RatingSlider label="Respect" value={assessment.respect} description="Respect for coaches, teammates, and opponents" />
          <RatingSlider label="Ambition" value={assessment.ambition} description="Drive to improve and succeed" />
          <RatingSlider label="Effort" value={assessment.effort} description="Work ethic and dedication" />
          <RatingSlider label="Humility" value={assessment.humility} description="Ability to learn from mistakes" />
        </div>

        {assessment.comments && (
          <div className="mt-2 rounded-xl border border-white/10 bg-white/5 p-4">
            <h4 className="mb-2 text-xs uppercase tracking-widest text-white/40 font-mono">Coach Comments</h4>
            <p className="text-sm text-white/80 font-sans italic">"{assessment.comments}"</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

function RatingSlider({ label, value, description }: { label: string; value: number | null; description: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-white font-sans">{label}</p>
          <p className="text-xs text-white/40 font-sans">{description}</p>
        </div>
        <div className="flex h-6 w-8 items-center justify-center rounded bg-white/10 text-xs font-mono text-white/80">
          {value !== null ? value : "N/A"}
        </div>
      </div>
      <div className="relative mt-2 h-1.5 w-full rounded-full bg-white/10">
        {value !== null && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(value / 10) * 100}%` }}
            transition={{ duration: 1, ease: SMOOTH_EASE }}
            className="absolute left-0 top-0 h-full rounded-full bg-white/40"
          />
        )}
        {/* Track markers */}
        <div className="absolute top-1/2 flex w-full -translate-y-1/2 justify-between px-[1px]">
          {[0, 5, 10].map((mark) => (
            <div key={mark} className="flex flex-col items-center">
              <div className="h-3 w-1 rounded-full bg-white/30" />
              <span className="mt-1 text-[10px] text-white/30">{mark}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="h-4" /> {/* Spacer for the labels */}
    </div>
  );
}