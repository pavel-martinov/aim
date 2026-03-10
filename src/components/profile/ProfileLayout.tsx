"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SMOOTH_EASE, DURATION } from "@/lib/animations";
import type { ProfileSection } from "@/types/user";

type Theme = "light" | "dark";

interface ProfileLayoutProps {
  children: React.ReactNode;
  activeSection: ProfileSection;
  onSectionChange: (section: ProfileSection) => void;
}

/** Sun icon for light mode */
function SunIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={className}>
      <circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.93 4.93l1.41 1.41M13.66 13.66l1.41 1.41M4.93 15.07l1.41-1.41M13.66 6.34l1.41-1.41" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/** Moon icon for dark mode */
function MoonIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const PROFILE_SECTIONS: { id: ProfileSection; label: string; icon: React.ReactNode }[] = [
  {
    id: "overview",
    label: "Overview",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="6" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M4 17c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "account",
    label: "Account",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 2v3M10 15v3M18 10h-3M5 10H2M15.657 4.343l-2.122 2.121M6.464 13.536l-2.121 2.121M15.657 15.657l-2.122-2.121M6.464 6.464L4.343 4.343" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "security",
    label: "Security",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="4" y="8" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 8V5a3 3 0 016 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="10" cy="13" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "billing",
    label: "Billing",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M2 8h16" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

/**
 * Netflix-style profile layout with sidebar on desktop, collapsible on mobile.
 */
export default function ProfileLayout({
  children,
  activeSection,
  onSectionChange,
}: ProfileLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>("dark");
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("profile-theme") as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("profile-theme", newTheme);
  }, [theme]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const handleSectionClick = (section: ProfileSection) => {
    onSectionChange(section);
    setIsMobileMenuOpen(false);
    contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-[var(--background)]">
      {/* Header */}
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-white/10 bg-[var(--background)]/95 px-4 backdrop-blur-md lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 transition-opacity hover:opacity-80"
          aria-label="Go to homepage"
        >
          <Image src="/Logotype.svg" alt="AIM" width={28} height={32} priority />
          <span
            className="hidden text-sm uppercase tracking-widest text-white/60 sm:block"
            style={{ fontFamily: "var(--font-geist-mono), monospace" }}
          >
            Account
          </span>
        </Link>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm text-white transition-colors hover:bg-white/10 lg:hidden"
          aria-expanded={isMobileMenuOpen}
          aria-label="Toggle menu"
        >
          <span>{PROFILE_SECTIONS.find((s) => s.id === activeSection)?.label}</span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            className={cn(
              "transition-transform duration-300",
              isMobileMenuOpen && "rotate-180"
            )}
          >
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/5 hover:text-white"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>

          {/* Desktop: Sign out link */}
          <Link
            href="/"
            className="hidden text-sm text-white/60 transition-colors hover:text-white lg:block"
            style={{ fontFamily: "var(--font-geist-mono), monospace" }}
          >
            Sign Out
          </Link>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Desktop sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-white/10 lg:block">
          <nav className="sticky top-16 flex flex-col gap-1 p-4">
            {PROFILE_SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => handleSectionClick(section.id)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-left text-sm transition-all duration-300",
                  activeSection === section.id
                    ? "bg-[var(--color-brand)]/10 text-[var(--color-brand)]"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
              >
                {section.icon}
                <span style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}>
                  {section.label}
                </span>
              </button>
            ))}

            <div className="my-4 h-px bg-white/10" />

            <Link
              href="/"
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7 17H4a2 2 0 01-2-2V5a2 2 0 012-2h3M13 14l4-4-4-4M17 10H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}>
                Sign Out
              </span>
            </Link>
          </nav>
        </aside>

        {/* Mobile menu overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: DURATION.fast }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Mobile menu panel */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ duration: DURATION.standard, ease: SMOOTH_EASE }}
              className="fixed inset-x-0 top-16 z-50 flex flex-col gap-1 border-b border-white/10 bg-[var(--background)] p-4 lg:hidden"
            >
              {PROFILE_SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => handleSectionClick(section.id)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-3 text-left text-sm transition-all duration-300",
                    activeSection === section.id
                      ? "bg-[var(--color-brand)]/10 text-[var(--color-brand)]"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  )}
                >
                  {section.icon}
                  <span style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}>
                    {section.label}
                  </span>
                </button>
              ))}

              <div className="my-2 h-px bg-white/10" />

              <Link
                href="/"
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7 17H4a2 2 0 01-2-2V5a2 2 0 012-2h3M13 14l4-4-4-4M17 10H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}>
                  Sign Out
                </span>
              </Link>
            </motion.nav>
          )}
        </AnimatePresence>

        {/* Main content */}
        <main
          ref={contentRef}
          className="flex-1 overflow-y-auto px-4 py-6 lg:px-8 lg:py-10"
        >
          <div className="mx-auto max-w-3xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: DURATION.fast, ease: SMOOTH_EASE }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
