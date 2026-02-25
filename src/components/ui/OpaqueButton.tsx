"use client";

import { cn } from "@/lib/utils";
import { EnterIcon } from "@/components/ui/icons/EnterIcon";

type OpaqueButtonBaseProps = {
  /** Visual variant: 'inline' for compact, 'card' for large hero-style, 'solid' for black bg on light sections */
  variant?: "inline" | "card" | "solid";
  className?: string;
  children: React.ReactNode;
  /** Show the enter/arrow icon */
  showIcon?: boolean;
};

type OpaqueButtonAsLinkProps = OpaqueButtonBaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children"> & {
    href: string;
  };

type OpaqueButtonAsButtonProps = OpaqueButtonBaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: never;
  };

export type OpaqueButtonProps = OpaqueButtonAsLinkProps | OpaqueButtonAsButtonProps;

/**
 * Button component with multiple variants.
 * - inline: compact header-style with frosted glass
 * - card: large hero-style with frosted glass, icon bottom-right
 * - solid: black bg for light sections, icon bottom-right
 */
export default function OpaqueButton(props: OpaqueButtonProps) {
  const { variant = "inline", showIcon = true, className, children, ...rest } = props;

  const isSolid = variant === "solid";
  const isCardLayout = variant === "card" || variant === "solid";

  const baseStyles = cn(
    "relative overflow-hidden rounded-xl font-mono uppercase tracking-[0.02em]",
    "transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
    "active:scale-[0.98]",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
  );

  const colorStyles = isSolid
    ? cn(
        "bg-black text-white",
        "hover:bg-zinc-800",
        "active:bg-zinc-900",
        "focus-visible:ring-black/50 focus-visible:ring-offset-white"
      )
    : cn(
        "bg-white/[0.12] backdrop-blur-sm text-white",
        "hover:bg-[var(--color-brand)] hover:text-black",
        "active:bg-white/[0.08]",
        "focus-visible:ring-white/50 focus-visible:ring-offset-transparent"
      );

  const variantStyles = {
    inline: "flex items-center gap-3 px-3 py-2 text-base",
    card: "flex flex-col justify-between p-3 h-[82px] md:h-[100px] text-base",
    solid: "flex flex-col justify-between p-3 w-full md:w-[240px] h-[82px] md:h-[100px] text-base",
  };

  const combinedClassName = cn(baseStyles, colorStyles, variantStyles[variant], className);

  const content = isCardLayout ? (
    <>
      <span className="text-left">{children}</span>
      {showIcon && (
        <div className="flex justify-end">
          <EnterIcon className="size-6" />
        </div>
      )}
    </>
  ) : (
    <>
      <span>{children}</span>
      {showIcon && <EnterIcon className="size-6" />}
    </>
  );

  if ("href" in rest && rest.href) {
    const { href, ...anchorRest } = rest as OpaqueButtonAsLinkProps;
    return (
      <a href={href} className={combinedClassName} {...anchorRest}>
        {content}
      </a>
    );
  }

  const { type = "button", ...buttonRest } = rest as OpaqueButtonAsButtonProps;
  return (
    <button type={type} className={combinedClassName} {...buttonRest}>
      {content}
    </button>
  );
}
