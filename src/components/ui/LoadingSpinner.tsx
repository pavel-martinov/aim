import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeStyles = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

/**
 * Animated loading spinner for buttons and loading states.
 */
export default function LoadingSpinner({ size = "sm", className }: LoadingSpinnerProps) {
  return (
    <svg
      className={cn("animate-spin", sizeStyles[size], className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" className="opacity-25" />
      <path d="M4 12a8 8 0 018-8" className="opacity-75" strokeLinecap="round" />
    </svg>
  );
}
