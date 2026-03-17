import { cn } from "@/lib/utils";

interface CheckIconProps {
  size?: number;
  className?: string;
}

/**
 * Check icon for selection indicators.
 */
export default function CheckIcon({ size = 12, className }: CheckIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" className={cn("text-black", className)}>
      <path
        d="M2.5 6l2.5 2.5 4.5-5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
