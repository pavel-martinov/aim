"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useHeaderTheme } from "@/contexts/HeaderThemeContext";
import ScrollProgressBar from "@/components/ui/ScrollProgressBar";
import MusicToggle from "@/components/ui/MusicToggle";
import { EnterIcon } from "@/components/ui/icons/EnterIcon";
import { DRAMATIC_EASE, SMOOTH_EASE } from "@/lib/animations";

/** Minimum scroll delta before direction change triggers hide/show */
const SCROLL_THRESHOLD = 10;

/** Navigation links for menu overlay */
const NAV_LINKS = [
  { href: "/home", label: "Home" },
  { href: "/about", label: "Mission" },
  { href: "/contact", label: "Contact" },
  { href: "/download", label: "Download" },
];

type HeaderProps = {
  visible?: boolean;
};

/** Hook for tracking scroll direction and position */
function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up");
  const [scrollY, setScrollY] = useState(0);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const updateScrollDirection = useCallback(() => {
    const currentY = window.scrollY;
    const delta = currentY - lastScrollY.current;

    if (Math.abs(delta) > SCROLL_THRESHOLD) {
      setScrollDirection(delta > 0 ? "down" : "up");
      lastScrollY.current = currentY;
    }

    setScrollY(currentY);
    ticking.current = false;
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(updateScrollDirection);
        ticking.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [updateScrollDirection]);

  return { scrollDirection, scrollY };
}

/** Full-screen menu overlay with slide-in panel */
function MenuOverlay({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dark backdrop */}
          <motion.div
            className="fixed inset-0 z-[100000] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: SMOOTH_EASE }}
            onClick={onClose}
            aria-hidden
          />

          {/* Slide-in panel from right */}
          <motion.div
            className="fixed right-0 top-0 z-[100001] flex h-full w-full max-w-md flex-col bg-zinc-800/95 backdrop-blur-md"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: DRAMATIC_EASE }}
          >
            {/* Panel header with logo and close button */}
            <div className="flex items-center justify-between px-8 py-6">
              <Link
                href="/home"
                onClick={onClose}
                className="transition-opacity hover:opacity-80"
              >
                <Image
                  src="/Logotype.svg"
                  alt="AIM"
                  width={23}
                  height={26}
                  className="h-7 w-auto"
                />
              </Link>

              <button
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center text-white/80 transition-colors hover:text-white"
                aria-label="Close menu"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Navigation links */}
            <nav className="flex flex-col gap-2 px-8 pt-8" aria-label="Main">
              {NAV_LINKS.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.1 + index * 0.05,
                    ease: DRAMATIC_EASE,
                  }}
                >
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className="block py-3 text-lg text-white/80 transition-colors hover:text-[var(--color-brand)]"
                    style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/** Renders progress bar + main header; fixed to viewport. Used inside portal. */
function HeaderContent({
  visible,
  isDark,
}: {
  visible: boolean;
  isDark: boolean;
}) {
  const { scrollDirection, scrollY } = useScrollDirection();
  const [viewportHeight, setViewportHeight] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setViewportHeight(window.innerHeight);
    const handleResize = () => setViewportHeight(window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Header visible when: in hero section OR scrolling up (after leaving hero)
  const isScrolledUp = scrollDirection === "up";
  const isInHero = scrollY < viewportHeight;
  const headerVisible = visible && (isInHero || isScrolledUp);

  // Show black background when scrolled past ~80% of hero (viewport height)
  const showBackground = scrollY > viewportHeight * 0.8;

  // Determine text color based on theme
  const isLightText = isDark || showBackground;

  return (
    <div className="pointer-events-none fixed inset-0 z-[99999]">
      <motion.header
        className="pointer-events-auto fixed left-0 right-0 top-0 flex flex-col"
        initial={false}
        animate={{
          opacity: headerVisible ? 1 : 0,
          y: headerVisible ? 0 : -24,
        }}
        transition={{ duration: 0.5, ease: DRAMATIC_EASE }}
      >
        {/* Animated black background layer */}
        <motion.div
          className="absolute inset-0 bg-black/90 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: showBackground ? 1 : 0 }}
          transition={{ duration: 0.4, ease: SMOOTH_EASE }}
          aria-hidden
        />

        {/* Progress bar at top */}
        <div className="relative flex h-5 items-center px-4 lg:px-6">
          <ScrollProgressBar />
        </div>

        <div className="relative flex h-[52px] items-center justify-between px-4 lg:px-6">
          {/* Logo (left) */}
          <Link
            href="/home"
            className="relative flex items-center transition-opacity hover:opacity-80"
            aria-label="AIM home"
          >
            <span
              className={`inline-block transition-[filter] duration-500 ${!isLightText ? "invert" : ""}`}
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
            className={`absolute left-1/2 hidden -translate-x-1/2 text-sm uppercase lg:block ${isLightText ? "text-white" : "text-zinc-900"} transition-colors duration-500`}
            style={{ fontFamily: "var(--font-geist-mono), monospace" }}
          >
            Creating Tomorrow&apos;s Champions
          </p>

          {/* Right side controls - responsive layout */}
          <div className="flex items-center gap-3">
            {/* Desktop/Tablet: MENU text button */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className={`hidden text-sm uppercase tracking-wider transition-colors duration-500 hover:text-[var(--color-brand)] md:block ${isLightText ? "text-white/90" : "text-zinc-900"}`}
              style={{ fontFamily: "var(--font-geist-mono), monospace" }}
              aria-label="Open menu"
            >
              Menu
            </button>

            {/* Divider - Desktop/Tablet only */}
            <span
              className={`hidden h-[18px] w-px transition-colors duration-500 md:block ${isLightText ? "bg-white/30" : "bg-zinc-400"}`}
              aria-hidden
            />

            {/* Sound toggle with icon */}
            <MusicToggle isDark={isLightText} />

            {/* Divider - Desktop/Tablet only */}
            <span
              className={`hidden h-[18px] w-px transition-colors duration-500 md:block ${isLightText ? "bg-white/30" : "bg-zinc-400"}`}
              aria-hidden
            />

            {/* Download button - Desktop/Tablet only */}
            <Link
              href="/download"
              className={`hidden items-center gap-3 rounded-xl px-3 py-2 text-base uppercase tracking-wider transition-all duration-300 md:flex ${isLightText ? "bg-white/10 text-white hover:bg-white hover:text-black" : "bg-zinc-900/10 text-zinc-900 hover:bg-zinc-900 hover:text-white"}`}
              style={{ fontFamily: "var(--font-geist-mono), monospace" }}
            >
              Download
              <EnterIcon className="size-6" />
            </Link>

            {/* Mobile: MENU pill button */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className={`flex items-center rounded-xl px-3 py-2 text-base uppercase tracking-wider transition-colors duration-500 md:hidden ${isLightText ? "bg-white/10 text-white hover:bg-white/20" : "bg-zinc-900/10 text-zinc-900 hover:bg-zinc-900/20"}`}
              style={{ fontFamily: "var(--font-geist-mono), monospace" }}
              aria-label="Open menu"
            >
              Menu
            </button>
          </div>
        </div>
      </motion.header>

      {/* Menu overlay */}
      <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  );
}

/** Header with MENU button and expandable overlay. Portals to body for proper fixed positioning. */
export default function Header({ visible = true }: HeaderProps) {
  const [mounted, setMounted] = useState(false);
  const { isDark } = useHeaderTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || typeof document === "undefined") return null;

  return createPortal(
    <HeaderContent visible={visible} isDark={isDark} />,
    document.body
  );
}
