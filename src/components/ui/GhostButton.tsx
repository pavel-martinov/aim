import { cn } from "@/lib/utils";

interface GhostButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** "sm" = px-4 py-2, "md" (default) = px-6 py-3 */
  size?: "sm" | "md";
}

/**
 * Outlined ghost button used for secondary/cancel actions across the profile and checkout UI.
 */
export default function GhostButton({ size = "md", className, ...props }: GhostButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        "rounded-xl border border-white/20 text-sm text-white/80 font-sans",
        "transition-all duration-300 hover:border-white/40 hover:bg-white/5 hover:text-white",
        "disabled:opacity-50",
        size === "sm" ? "px-4 py-2 rounded-lg" : "px-6 py-3",
        className
      )}
    />
  );
}
