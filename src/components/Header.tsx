"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useHeaderTheme } from "@/contexts/HeaderThemeContext";
import MusicToggle from "@/components/ui/MusicToggle";
import { useOptionalAudio } from "@/contexts/AudioContext";
import { DRAMATIC_EASE, SMOOTH_EASE, DURATION } from "@/lib/animations";
import { openDownloadStore } from "@/lib/download";

type NavLink = {
  href: string;
  label: string;
  action?: "download";
};

/** Navigation links - Logo serves as home button */
const NAV_LINKS: readonly NavLink[] = [
  { href: "/about", label: "About" },
  { href: "/membership", label: "Pricing" },
  { href: "/academies", label: "Academies" },
  { href: "#", label: "Download", action: "download" },
];

type HeaderProps = {
  visible?: boolean;
};

/**
 * Animated dot grid icon that morphs between 9 dots (3x3) and 4 dots (2x2 corners).
 */
function DotGridIcon({ isOpen }: { isOpen: boolean }) {
  const dotColor = "#121212";
  const dotSize = 3;
  const gridSize = 17;
  const spacing = (gridSize - dotSize * 3) / 2;

  const getDotPosition = (index: number, expanded: boolean) => {
    const row = Math.floor(index / 3);
    const col = index % 3;

    if (!expanded) {
      return {
        x: col * (dotSize + spacing),
        y: row * (dotSize + spacing),
        opacity: 1,
        scale: 1,
      };
    }

    const isCorner = (row === 0 || row === 2) && (col === 0 || col === 2);
    if (isCorner) {
      const cornerX = col === 0 ? 0 : gridSize - dotSize;
      const cornerY = row === 0 ? 0 : gridSize - dotSize;
      return { x: cornerX, y: cornerY, opacity: 1, scale: 1.2 };
    }

    return {
      x: col * (dotSize + spacing),
      y: row * (dotSize + spacing),
      opacity: 0,
      scale: 0.5,
    };
  };

  return (
    <svg
      width={gridSize}
      height={gridSize}
      viewBox={`0 0 ${gridSize} ${gridSize}`}
      className="overflow-visible"
    >
      {Array.from({ length: 9 }).map((_, i) => {
        const pos = getDotPosition(i, isOpen);
        return (
          <motion.circle
            key={i}
            r={dotSize / 2}
            fill={dotColor}
            initial={false}
            animate={{
              cx: pos.x + dotSize / 2,
              cy: pos.y + dotSize / 2,
              opacity: pos.opacity,
              scale: pos.scale,
            }}
            transition={{
              duration: DURATION.standard,
              ease: DRAMATIC_EASE,
            }}
          />
        );
      })}
    </svg>
  );
}

/**
 * Glassmorphic navigation pill button for desktop layout.
 * Adapts colors based on background darkness.
 */
function NavPill({
  href,
  label,
  action,
  onClick,
  isDark,
}: {
  href: string;
  label: string;
  action?: "download";
  onClick?: () => void;
  isDark: boolean;
}) {
  const baseClasses = `flex flex-1 items-center justify-center h-[38px] px-[18px] py-[13px] rounded-lg backdrop-blur-[10px] text-base font-medium uppercase transition-all duration-[650ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
    isDark
      ? "bg-[rgba(237,237,237,0.2)] text-[#eee] hover:bg-[rgba(237,237,237,0.35)] hover:text-white"
      : "bg-[rgba(0,0,0,0.08)] text-zinc-900 hover:bg-[rgba(0,0,0,0.15)] hover:text-black"
  }`;

  const pathname = usePathname();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === href) {
      e.preventDefault();
      window.dispatchEvent(new Event("aim:scroll-to-top"));
    }
    onClick?.();
  };

  if (action === "download") {
    return (
      <button onClick={openDownloadStore} className={baseClasses}>
        {label}
      </button>
    );
  }

  return (
    <Link href={href} onClick={handleClick} className={baseClasses}>
      {label}
    </Link>
  );
}

/**
 * Mobile menu button item with glassmorphic or brand styling.
 */
function MobileMenuItem({
  href,
  label,
  action,
  variant = "glass",
  onClick,
  delay,
}: {
  href: string;
  label: string;
  action?: "download";
  variant?: "glass" | "brand";
  onClick?: () => void;
  delay: number;
}) {
  const glassClasses =
    "flex w-full items-center h-[46px] px-[18px] rounded-lg bg-[rgba(237,237,237,0.2)] backdrop-blur-[10px] text-[#eee] text-base font-medium uppercase transition-all duration-[650ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-[rgba(237,237,237,0.35)]";
  const brandClasses =
    "flex w-full items-center h-[46px] px-[18px] rounded-lg bg-[var(--color-brand)] text-black text-base font-medium uppercase transition-all duration-[650ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:brightness-110";

  const classes = variant === "brand" ? brandClasses : glassClasses;

  const pathname = usePathname();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === href) {
      e.preventDefault();
      window.dispatchEvent(new Event("aim:scroll-to-top"));
    }
    onClick?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{
        duration: DURATION.standard,
        delay,
        ease: DRAMATIC_EASE,
      }}
      className="w-full"
    >
      {action === "download" ? (
        <button onClick={() => { openDownloadStore(); onClick?.(); }} className={classes}>
          {label}
        </button>
      ) : (
        <Link href={href} onClick={handleClick} className={classes}>
          {label}
        </Link>
      )}
    </motion.div>
  );
}

/**
 * Mobile expandable menu panel with staggered animation.
 * Includes MusicToggle as a menu item.
 */
function MobileMenuPanel({
  isExpanded,
  onLinkClick,
}: {
  isExpanded: boolean;
  onLinkClick: () => void;
}) {
  const audio = useOptionalAudio();

  return (
    <AnimatePresence>
      {isExpanded && (
        <motion.div
          className="flex flex-col gap-1 pt-1 pb-4"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: DURATION.standard, ease: DRAMATIC_EASE }}
        >
          {NAV_LINKS.map((link, index) => (
            <MobileMenuItem
              key={link.label}
              href={link.href}
              label={link.label}
              action={link.action}
              onClick={onLinkClick}
              delay={0.1 + index * 0.08}
            />
          ))}

          {/* MusicToggle as menu item */}
          {audio && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{
                duration: DURATION.standard,
                delay: 0.1 + NAV_LINKS.length * 0.08,
                ease: DRAMATIC_EASE,
              }}
              className="w-full"
            >
              <div className="flex w-full items-center h-[38px] px-[18px] rounded-lg bg-[rgba(237,237,237,0.2)] backdrop-blur-[10px]">
                <MusicToggle isDark={true} />
              </div>
            </motion.div>
          )}

          <MobileMenuItem
            href="/log-in"
            label="Log In"
            variant="brand"
            onClick={onLinkClick}
            delay={0.1 + (NAV_LINKS.length + (audio ? 1 : 0)) * 0.08}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Main header content with responsive layouts for desktop, tablet, and mobile.
 */
function HeaderContent({
  visible,
  isDark,
}: {
  visible: boolean;
  isDark: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const audio = useOptionalAudio();
  const logoClass = "h-[26px] w-auto brightness-0";

  const handleMobileMenuToggle = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const handleLinkClick = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const handleLogoClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Always force the home route to start at the very top.
      e.preventDefault();
      setIsMobileMenuOpen(false);

      if (pathname === "/home") {
        window.dispatchEvent(new Event("aim:scroll-to-top"));
        return;
      }

      router.push("/home");
      requestAnimationFrame(() => {
        window.dispatchEvent(new Event("aim:scroll-instant-top"));
        window.scrollTo({ top: 0, behavior: "auto" });
      });
    },
    [pathname, router]
  );

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isMobileMenuOpen]);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[99999] h-0 overflow-visible">
      {/* Mobile menu backdrop */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.standard, ease: SMOOTH_EASE }}
            className="pointer-events-auto fixed inset-0 z-0 bg-black/50 md:hidden"
            onClick={handleLinkClick}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <motion.header
        className="pointer-events-auto absolute left-0 right-0 top-0 z-10"
        initial={false}
        animate={{
          opacity: visible ? 1 : 0,
          y: visible ? 0 : -24,
        }}
        transition={{ duration: DURATION.exit, ease: DRAMATIC_EASE }}
      >
        {/* Desktop/Tablet Layout (md+) */}
        <nav
          className="hidden md:flex items-center gap-1 px-5 pt-[21px]"
          aria-label="Main navigation"
        >
          {/* Logo button */}
          <Link
            href="/home"
            onClick={handleLogoClick}
            className="flex h-[37px] w-[75px] items-center justify-center rounded-lg bg-[var(--color-brand)] transition-all duration-[650ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:brightness-110"
            aria-label="AIM home"
          >
            <Image
              src="/Logotype.svg"
              alt="AIM"
              width={23}
              height={26}
              className={logoClass}
            />
          </Link>

          {/* Nav pills */}
          <div className="flex flex-1 gap-1">
            {NAV_LINKS.map((link) => (
              <NavPill
                key={link.label}
                href={link.href}
                label={link.label}
                action={link.action}
                onClick={handleLinkClick}
                isDark={isDark}
              />
            ))}
          </div>

          {/* Sound toggle */}
          {audio && (
            <div className={`flex h-[38px] items-center justify-center rounded-lg backdrop-blur-[10px] px-4 ${
              isDark ? "bg-[rgba(237,237,237,0.2)]" : "bg-[rgba(0,0,0,0.08)]"
            }`}>
              <MusicToggle isDark={isDark} />
            </div>
          )}

          {/* Log In button */}
          <Link
            href="/log-in"
            className="flex h-[38px] items-center justify-center rounded-lg bg-[var(--color-brand)] px-6 py-2 font-mono text-base uppercase tracking-wider text-[#121212] transition-all duration-[650ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:brightness-110"
          >
            Log In
          </Link>
        </nav>

        {/* Mobile Layout (<md) */}
        <div className="md:hidden px-4 pt-[22px]">
          <div className="flex flex-col gap-1">
            {/* Top row - MusicToggle left, Logo+MenuBtn right (expands to full width) */}
            <div className="relative flex items-center justify-end h-[46px]">
              {/* MusicToggle on left - fades out when menu opens */}
              <AnimatePresence>
                {!isMobileMenuOpen && audio && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, ease: SMOOTH_EASE }}
                    className="absolute left-0 flex h-[46px] items-center px-[18px] rounded-lg bg-[rgba(237,237,237,0.2)] backdrop-blur-[10px]"
                  >
                    <MusicToggle isDark={true} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Logo + Menu button container - expands from right to full width */}
              <motion.div
                className="flex h-[46px] overflow-hidden"
                initial={false}
                animate={{
                  width: isMobileMenuOpen ? "100%" : "auto",
                }}
                transition={{
                  duration: DURATION.standard,
                  ease: DRAMATIC_EASE,
                }}
              >
                {/* Logo section - rounded left only, expands to fill space */}
                <motion.div
                  className="flex h-[46px] flex-1 items-center pl-4 rounded-l-md"
                  animate={{
                    backgroundColor: isMobileMenuOpen ? "#eeeeee" : "var(--color-brand)",
                  }}
                  transition={{ duration: DURATION.standard, ease: SMOOTH_EASE }}
                >
                  <Link
                    href="/home"
                    onClick={handleLogoClick}
                    className="flex items-center transition-opacity hover:opacity-80"
                    aria-label="AIM home"
                  >
                    <Image
                      src="/Logotype.svg"
                      alt="AIM"
                      width={22}
                      height={26}
                      className={logoClass}
                    />
                  </Link>
                </motion.div>

                {/* Menu toggle button - rounded right only */}
                <motion.button
                  onClick={handleMobileMenuToggle}
                  className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-r-md transition-opacity hover:opacity-80"
                  animate={{
                    backgroundColor: isMobileMenuOpen ? "#eeeeee" : "var(--color-brand)",
                  }}
                  transition={{ duration: DURATION.standard, ease: SMOOTH_EASE }}
                  aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                  aria-expanded={isMobileMenuOpen}
                >
                  <DotGridIcon isOpen={isMobileMenuOpen} />
                </motion.button>
              </motion.div>
            </div>

            {/* Expanded menu panel */}
            <MobileMenuPanel
              isExpanded={isMobileMenuOpen}
              onLinkClick={handleLinkClick}
            />
          </div>
        </div>
      </motion.header>
    </div>
  );
}

/** Header with responsive navigation. Portals to body for proper fixed positioning. */
export default function Header({ visible = true }: HeaderProps) {
  const [mounted, setMounted] = useState(false);
  const { isDark } = useHeaderTheme();

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(id);
  }, []);

  if (!mounted || typeof document === "undefined") return null;

  return createPortal(<HeaderContent visible={visible} isDark={isDark} />, document.body);
}
