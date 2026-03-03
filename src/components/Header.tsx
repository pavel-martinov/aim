"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useHeaderTheme } from "@/contexts/HeaderThemeContext";
import ScrollProgressBar from "@/components/ui/ScrollProgressBar";
import MusicToggle from "@/components/ui/MusicToggle";
import OpaqueButton from "@/components/ui/OpaqueButton";
import { DRAMATIC_EASE, SMOOTH_EASE, DURATION } from "@/lib/animations";
import { openDownloadStore } from "@/lib/download";

/** Menu links matching Figma design with mapped routes */
const MENU_LINKS = [
  { href: "/about", label: "About" },
  { href: "/membership", label: "Membership" },
  { label: "Download", action: openDownloadStore },
] as const;

type HeaderProps = {
  visible?: boolean;
};

/** Hook for tracking vertical scroll position */
function useScrollPosition() {
  const [scrollY, setScrollY] = useState(0);
  const ticking = useRef(false);

  const updateScrollPosition = useCallback(() => {
    setScrollY(window.scrollY);
    ticking.current = false;
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(updateScrollPosition);
        ticking.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [updateScrollPosition]);

  return { scrollY };
}

/** Animated hamburger icon that morphs to X */
function HamburgerIcon({ isOpen, isDark }: { isOpen: boolean; isDark: boolean }) {
  const lineClass = `block h-[2px] rounded-full transition-all duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
    isDark ? "bg-white" : "bg-zinc-900"
  }`;

  return (
    <div className="relative flex h-[15px] w-[24px] flex-col justify-between">
      <span
        className={lineClass}
        style={{
          width: "24px",
          transform: isOpen ? "translateY(6.5px) rotate(45deg)" : "none",
        }}
      />
      <span
        className={lineClass}
        style={{
          width: "18px",
          opacity: isOpen ? 0 : 1,
          transform: isOpen ? "translateX(-8px)" : "none",
        }}
      />
      <span
        className={lineClass}
        style={{
          width: isOpen ? "24px" : "12px",
          transform: isOpen ? "translateY(-6.5px) rotate(-45deg)" : "none",
        }}
      />
    </div>
  );
}

/** Full-screen mobile/tablet menu overlay with centered links */
function MobileTabletMenuPanel({
  isExpanded,
  onLinkClick,
}: {
  isExpanded: boolean;
  onLinkClick: () => void;
}) {
  return (
    <AnimatePresence>
      {isExpanded && (
        <motion.div
          className="fixed inset-0 z-[99998] overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: DURATION.standard, ease: DRAMATIC_EASE }}
        >
          <div className="absolute inset-0 bg-black/95 backdrop-blur-md" aria-hidden />
          <nav
            className="relative flex h-dvh flex-col items-center justify-center gap-7 px-6 text-center"
            aria-label="Main navigation"
          >
            {[{ href: "/home", label: "Home" }, ...MENU_LINKS].map((link, index) => (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{
                  duration: DURATION.standard,
                  delay: 0.05 + index * 0.06,
                  ease: DRAMATIC_EASE,
                }}
              >
                {"href" in link ? (
                  <Link
                    href={link.href}
                    onClick={onLinkClick}
                    className="block text-4xl font-medium text-white transition-colors duration-[650ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:text-[var(--color-brand)] focus-visible:text-[var(--color-brand)] focus-visible:outline-none md:text-5xl"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      link.action();
                      onLinkClick();
                    }}
                    className="block text-4xl font-medium text-white transition-colors duration-[650ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:text-[var(--color-brand)] focus-visible:text-[var(--color-brand)] focus-visible:outline-none md:text-5xl"
                  >
                    {link.label}
                  </button>
                )}
              </motion.div>
            ))}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Desktop expanded menu panel with image */
function DesktopMenuPanel({
  isExpanded,
  isLightText,
}: {
  isExpanded: boolean;
  isLightText: boolean;
}) {
  return (
    <AnimatePresence>
      {isExpanded && (
        <motion.div
          className="relative border-t border-white/[0.17]"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: DURATION.standard, ease: DRAMATIC_EASE }}
        >
          {/* Two-column layout: image left, links right */}
          <div className="flex">
            {/* Image column */}
            <div className="flex-1">
              <div className="relative h-[295px] w-full overflow-hidden">
                <Image
                  src="/images/data-analysis.jpg"
                  alt=""
                  fill
                  className="object-cover"
                  sizes="50vw"
                  priority
                />
              </div>
            </div>

            {/* Links column */}
            <div className="flex flex-1 flex-col justify-center gap-[18px] px-8 py-6 h-[295px]">
              {MENU_LINKS.map((link, index) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{
                    duration: DURATION.standard,
                    delay: 0.05 + index * 0.06,
                    ease: DRAMATIC_EASE,
                  }}
                >
                  {"href" in link ? (
                    <Link
                      href={link.href}
                      className={`block text-[52px] font-medium capitalize transition-all duration-[650ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
                        isLightText ? "text-white" : "text-zinc-900"
                      } hover:text-[var(--color-brand)] hover:translate-x-2 focus-visible:text-[var(--color-brand)] focus-visible:outline-none`}
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <button
                      onClick={link.action}
                      className={`block text-left text-[52px] font-medium capitalize transition-all duration-[650ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
                        isLightText ? "text-white" : "text-zinc-900"
                      } hover:text-[var(--color-brand)] hover:translate-x-2 focus-visible:text-[var(--color-brand)] focus-visible:outline-none`}
                    >
                      {link.label}
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Lower edge blur gradient */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/60 to-transparent backdrop-blur-[2px]"
            style={{ maskImage: "linear-gradient(to top, black 30%, transparent)" }}
            aria-hidden
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Renders progress bar + main header; fixed to viewport. */
function HeaderContent({
  visible,
  isDark,
}: {
  visible: boolean;
  isDark: boolean;
}) {
  const { scrollY } = useScrollPosition();
  const [viewportHeight, setViewportHeight] = useState(
    typeof window !== "undefined" ? window.innerHeight : 0
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopMenuHovered, setIsDesktopMenuHovered] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Start tracking window resize after initial mount to avoid hydration mismatch
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setViewportHeight(window.innerHeight), 100);
    };
    
    // Initial set deferred
    setTimeout(() => {
      setViewportHeight(window.innerHeight);
    }, 0);
    
    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const headerVisible = visible;
  const showBackground = scrollY > viewportHeight * 0.8;
  const isLightText = isDark || showBackground;

  /** Handle hover with small delay to prevent flicker (desktop only) */
  const handleMouseEnter = useCallback(() => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsDesktopMenuHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsDesktopMenuHovered(false);
    }, 150);
  }, []);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  const handleMobileMenuToggle = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const handleMobileLinkClick = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isMobileMenuOpen]);

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-[99999] h-0 overflow-visible">
      <motion.header
        className="pointer-events-auto absolute left-0 right-0 top-0 flex max-w-full flex-col"
        initial={false}
        animate={{
          opacity: headerVisible ? 1 : 0,
          y: headerVisible ? 0 : -24,
        }}
        transition={{ duration: DURATION.exit, ease: DRAMATIC_EASE }}
      >
        {/* Animated black background layer */}
        <motion.div
          className="absolute inset-0 bg-black/90 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{
            opacity: showBackground || isDesktopMenuHovered || isMobileMenuOpen ? 1 : 0,
          }}
          transition={{ duration: DURATION.exit, ease: SMOOTH_EASE }}
          aria-hidden
        />

        {/* Progress bar at top */}
        <div className="relative flex h-5 items-center px-4 lg:px-6">
          <ScrollProgressBar />
        </div>

        {/* Main header row */}
        <div className="relative z-[99999] flex h-[52px] items-center justify-between px-4 lg:px-6">
          {/* Logo (left) */}
          <Link
            href="/home"
            className="relative flex items-center transition-opacity hover:opacity-80"
            aria-label="AIM home"
          >
            <span
              className={`inline-block transition-[filter] duration-500 ${
                !isLightText && !isDesktopMenuHovered && !isMobileMenuOpen ? "invert" : ""
              }`}
            >
              <Image
                src="/Logotype.svg"
                alt="AIM"
                width={23}
                height={26}
                className="h-7 w-auto"
              />
            </span>
          </Link>

          {/* Center tagline - Desktop only */}
          <p
            className={`absolute left-1/2 hidden -translate-x-1/2 text-sm uppercase lg:block transition-colors duration-500 ${
              isLightText || isDesktopMenuHovered ? "text-white" : "text-zinc-900"
            }`}
            style={{ fontFamily: "var(--font-geist-mono), monospace" }}
          >
            Creating Tomorrow&apos;s Champions
          </p>

          {/* Right side controls */}
          <div className="flex items-center gap-3">
            {/* Desktop only: MENU trigger */}
            <button
              className={`hidden items-center text-sm uppercase tracking-wider transition-colors duration-500 lg:flex ${
                isLightText || isDesktopMenuHovered
                  ? "text-white/90 hover:text-[var(--color-brand)]"
                  : "text-zinc-900 hover:text-[var(--color-brand)]"
              }`}
              style={{ fontFamily: "var(--font-geist-mono), monospace" }}
              aria-expanded={isDesktopMenuHovered}
              aria-haspopup="menu"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              MENU
            </button>

            {/* Divider - Desktop only */}
            <span
              className={`hidden h-[18px] w-px transition-colors duration-500 lg:block ${
                isLightText || isDesktopMenuHovered ? "bg-white/30" : "bg-zinc-400"
              }`}
              aria-hidden
            />

            {/* Sound toggle with icon */}
            <MusicToggle isDark={isLightText || isDesktopMenuHovered || isMobileMenuOpen} />

            {/* Divider - Desktop only */}
            <span
              className={`hidden h-[18px] w-px transition-colors duration-500 lg:block ${
                isLightText || isDesktopMenuHovered ? "bg-white/30" : "bg-zinc-400"
              }`}
              aria-hidden
            />

            {/* Download button - Desktop only */}
            <OpaqueButton
              variant="inline"
              onClick={openDownloadStore}
              className="hidden lg:flex"
            >
              Download
            </OpaqueButton>

            {/* Mobile/Tablet: Hamburger button */}
            <button
              onClick={handleMobileMenuToggle}
              className={`flex items-center gap-2 rounded-xl px-3 py-2 transition-colors duration-500 lg:hidden ${
                isLightText || isMobileMenuOpen
                  ? "bg-white/[0.12] hover:bg-white/20"
                  : "bg-zinc-900/10 hover:bg-zinc-900/20"
              }`}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              <HamburgerIcon isOpen={isMobileMenuOpen} isDark={isLightText || isMobileMenuOpen} />
            </button>
          </div>
        </div>

        {/* Desktop expanded menu panel */}
        <div
          className="hidden lg:block"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <DesktopMenuPanel
            isExpanded={isDesktopMenuHovered}
            isLightText={isLightText || isDesktopMenuHovered}
          />
        </div>
      </motion.header>

      {/* Mobile/Tablet inline menu panel - placed outside motion.header to avoid transform containing block issues */}
      <div className="pointer-events-auto lg:hidden">
        <MobileTabletMenuPanel
          isExpanded={isMobileMenuOpen}
          onLinkClick={handleMobileLinkClick}
        />
      </div>
    </div>
  );
}

/** Header with expandable menu. Portals to body for proper fixed positioning. */
export default function Header({ visible = true }: HeaderProps) {
  const [mounted, setMounted] = useState(false);
  const { isDark } = useHeaderTheme();

  useEffect(() => {
    // Defer setting mounted to avoid cascading renders
    const isMounted = true;
    setTimeout(() => {
      if (isMounted) {
        setMounted(true);
      }
    }, 0);
  }, []);

  if (!mounted || typeof document === "undefined") return null;

  return createPortal(
    <HeaderContent visible={visible} isDark={isDark} />,
    document.body
  );
}
