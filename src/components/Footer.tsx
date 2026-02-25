"use client";

import Image from "next/image";
import Link from "next/link";

/**
 * Minimalistic footer inspired by AVATR design.
 * Includes logo, download buttons, contact info, legal links, and social icons.
 */
export default function Footer() {
  return (
    <footer className="w-full bg-black">
      {/* Subtle top border */}
      <div className="h-px w-full bg-white/10" />

      {/* Main content */}
      <div className="flex w-full flex-col gap-12 px-6 py-16 lg:flex-row lg:items-start lg:justify-between lg:px-12 lg:py-20">
        {/* Left - Logo and download buttons */}
        <div className="flex flex-col gap-8">
          <Link href="/" className="transition-opacity hover:opacity-80">
            <Image
              src="/Logotype.svg"
              alt="AIM"
              width={32}
              height={36}
              className="h-9 w-auto"
            />
          </Link>

          {/* Download buttons */}
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <DownloadButton
              platform="ios"
              href="https://apps.apple.com/in/app/aim-football/id6757197350"
              label="Download for iOS"
            />
            <DownloadButton
              platform="android"
              href="https://play.google.com/store/apps/details?id=com.aimreltechnology.aim&pcampaignid=web_share"
              label="Download for Android"
            />
          </div>
        </div>

        {/* Right - Contact info */}
        <div className="flex flex-col gap-2">
          <span
            className="mb-2 text-sm uppercase tracking-wide text-white/50"
            style={{ fontFamily: "var(--font-geist-mono), monospace" }}
          >
            Contact
          </span>
          <a
            href="mailto:support@aim.io"
            className="text-sm text-white/80 transition-colors hover:text-[var(--color-brand)]"
            style={{ fontFamily: "var(--font-geist-mono), monospace" }}
          >
            support@aim.io
          </a>
          <a
            href="mailto:partnerships@aim.io"
            className="text-sm text-white/80 transition-colors hover:text-[var(--color-brand)]"
            style={{ fontFamily: "var(--font-geist-mono), monospace" }}
          >
            partnerships@aim.io
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="h-px w-full bg-white/10" />
      <div className="flex w-full flex-col items-center justify-between gap-6 px-6 py-6 lg:px-12 md:flex-row">
        {/* Copyright */}
        <p
          className="text-xs text-white/40"
          style={{ fontFamily: "var(--font-geist-mono), monospace" }}
        >
          © 2025 AIM, Inc.
        </p>

        {/* Legal links */}
        <nav className="flex flex-wrap items-center justify-center gap-6">
          <FooterLink href="/partnerships">Partnerships</FooterLink>
          <FooterLink href="/terms">Legal Terms</FooterLink>
          <FooterLink href="/privacy">Privacy Policy</FooterLink>
        </nav>

        {/* Social icons */}
        <div className="flex items-center gap-4">
          <SocialIcon href="https://instagram.com" label="Instagram">
            <InstagramIcon />
          </SocialIcon>
          <SocialIcon href="https://youtube.com" label="YouTube">
            <YouTubeIcon />
          </SocialIcon>
          <SocialIcon href="https://linkedin.com" label="LinkedIn">
            <LinkedInIcon />
          </SocialIcon>
        </div>
      </div>
    </footer>
  );
}

/** Download button with platform icon */
function DownloadButton({
  platform,
  href,
  label,
}: {
  platform: "ios" | "android";
  href: string;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="btn-fill-hover flex items-center gap-3 border border-white/30 bg-transparent px-5 py-3 text-xs uppercase tracking-wider text-white transition-all hover:border-[var(--color-brand)]"
      style={{ fontFamily: "var(--font-geist-mono), monospace" }}
    >
      {platform === "ios" ? <AppleIcon /> : <AndroidIcon />}
      <span>{label}</span>
    </a>
  );
}

/** Footer navigation link */
function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-xs text-white/60 underline-offset-4 transition-colors hover:text-white hover:underline"
      style={{ fontFamily: "var(--font-geist-mono), monospace" }}
    >
      {children}
    </Link>
  );
}

/** Social icon button wrapper */
function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
    >
      {children}
    </a>
  );
}

/** Apple icon for iOS download */
function AppleIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

/** Android/Play Store icon */
function AndroidIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" />
    </svg>
  );
}

/** Instagram icon */
function InstagramIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

/** YouTube icon */
function YouTubeIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

/** LinkedIn icon */
function LinkedInIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
