"use client";

import { cn } from "@/lib/utils";
import { EnterIcon } from "@/components/ui/icons/EnterIcon";

type OpaqueButtonBaseProps = {
  /** Visual variant: 'inline' for compact header-style, 'brand' for green main CTA (default), 'dark' for semi-transparent card CTA */
  variant?: "inline" | "brand" | "dark";
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
 * Primary CTA button with elegant smooth transitions.
 * - inline: compact header-style button
 * - brand (default): green main CTA (#24ff00), full-width on mobile, 240px on desktop
 * - dark: semi-transparent card CTA, same layout as brand but dark styling
 */
export default function OpaqueButton(props: OpaqueButtonProps) {
  const { variant = "brand", showIcon = true, className, children, ...rest } = props;

  const isCardLayout = variant === "brand" || variant === "dark";

  const baseStyles = cn(
    "relative overflow-hidden rounded-xl font-mono uppercase tracking-[0.02em]",
    "transition-all duration-[650ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
    "motion-reduce:transition-none motion-reduce:duration-0",
    "active:scale-[0.98] active:duration-100",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
  );

  const colorStyles =
    variant === "brand"
      ? cn(
          "bg-[var(--color-brand)] text-black",
          "hover:brightness-110 hover:shadow-[0_8px_30px_rgba(36,255,0,0.25)]",
          "active:brightness-95 active:shadow-none",
          "focus-visible:ring-[var(--color-brand)] focus-visible:ring-offset-black"
        )
      : cn(
          "bg-white/[0.12] backdrop-blur-sm text-white",
          "hover:bg-[var(--color-brand)] hover:text-black",
          "active:brightness-95",
          "focus-visible:ring-white/50 focus-visible:ring-offset-transparent"
        );

  const variantStyles: Record<string, string> = {
    inline: "flex items-center gap-3 px-3 py-2 text-base",
    brand: "flex flex-col justify-between p-3 w-full md:w-[240px] h-[100px] text-base",
    dark: "flex flex-col justify-between p-3 w-full md:w-[240px] h-[100px] text-base",
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
    const isExternal = href.startsWith("http");
    return (
      <a
        href={href}
        className={combinedClassName}
        {...(isExternal && { target: "_blank", rel: "noopener noreferrer" })}
        {...anchorRest}
      >
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
