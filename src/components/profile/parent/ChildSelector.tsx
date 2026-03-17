"use client";

import { motion } from "framer-motion";
import AvatarFallback from "@/components/ui/AvatarFallback";
import CheckIcon from "@/components/ui/CheckIcon";
import { cn } from "@/lib/utils";
import { SMOOTH_EASE, DURATION } from "@/lib/animations";
import { DIVISION_CONFIG } from "@/lib/constants";
import type { ChildProfile } from "@/types/user";

interface ChildSelectorProps {
  children: ChildProfile[];
  selectedId: string;
  onSelect: (id: string) => void;
}

/**
 * Horizontal scrollable selector for switching between children.
 */
export default function ChildSelector({ children, selectedId, onSelect }: ChildSelectorProps) {
  if (children.length === 0) return null;

  return (
    <div className="relative -mx-4 px-4 sm:-mx-0 sm:px-0">
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {children.map((child, index) => (
          <ChildCard
            key={child.id}
            child={child}
            isSelected={child.id === selectedId}
            onSelect={() => onSelect(child.id)}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}

interface ChildCardProps {
  child: ChildProfile;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}

/** Individual child selection card with avatar and basic info. */
function ChildCard({ child, isSelected, onSelect, index }: ChildCardProps) {
  const divisionConfig = DIVISION_CONFIG[child.division];

  return (
    <motion.button
      onClick={onSelect}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.standard, ease: SMOOTH_EASE, delay: index * 0.1 }}
      className={cn(
        "flex shrink-0 items-center gap-3 rounded-xl border p-3 transition-all duration-300",
        isSelected
          ? "border-[var(--color-brand)] bg-[var(--color-brand)]/10"
          : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
      )}
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        <AvatarFallback
          src={child.avatarUrl}
          name={child.name}
          size="md"
          borderClassName="border-2 border-white/10"
        />
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-brand)]"
          >
            <CheckIcon />
          </motion.div>
        )}
      </div>

      {/* Info */}
      <div className="text-left">
        <p className="text-sm font-medium text-white font-sans">{child.name}</p>
        <div className="flex items-center gap-2 text-xs text-white/50 font-mono">
          <span>LVL {child.level}</span>
          <span className="text-white/20">•</span>
          <span style={{ color: divisionConfig.color }}>{divisionConfig.label}</span>
        </div>
      </div>
    </motion.button>
  );
}
