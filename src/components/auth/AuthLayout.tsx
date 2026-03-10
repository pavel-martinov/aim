"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import BackgroundVideo from "@/components/ui/BackgroundVideo";
import { DURATION, GSAP_EASE } from "@/lib/animations";

type AuthLayoutProps = {
  children: React.ReactNode;
  /** Optional headline displayed above the form */
  headline?: React.ReactNode;
  /** Optional subheadline/description */
  subheadline?: React.ReactNode;
  /** Optional right-side video source */
  videoSrc?: string;
};

/**
 * Shared 50/50 split layout for auth pages.
 * Left: logo + form content, Right: background video.
 */
export default function AuthLayout({
  children,
  headline,
  subheadline,
  videoSrc = "/HeroVideoBG.mp4",
}: AuthLayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: GSAP_EASE.dramatic } });

      if (logoRef.current) {
        gsap.set(logoRef.current, { opacity: 0, y: -20 });
        tl.to(logoRef.current, { opacity: 1, y: 0, duration: DURATION.standard }, 0);
      }

      if (headlineRef.current) {
        gsap.set(headlineRef.current, { opacity: 0, y: 30 });
        tl.to(headlineRef.current, { opacity: 1, y: 0, duration: DURATION.hero }, 0.1);
      }

      if (subheadlineRef.current) {
        gsap.set(subheadlineRef.current, { opacity: 0, y: 20 });
        tl.to(subheadlineRef.current, { opacity: 1, y: 0, duration: DURATION.standard }, 0.2);
      }

      if (formRef.current) {
        gsap.set(formRef.current, { opacity: 0, y: 30 });
        tl.to(formRef.current, { opacity: 1, y: 0, duration: DURATION.standard }, 0.3);
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative flex min-h-screen w-full flex-col lg:flex-row">
      {/* Left side - Logo and form */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-16 lg:w-1/2 lg:px-16 xl:px-24">
        <div className="mx-auto flex w-full max-w-[400px] flex-col gap-8">
          {/* Logo - links to homepage */}
          <Link
            ref={logoRef}
            href="/"
            className="mb-4 inline-block w-fit transition-opacity duration-300 hover:opacity-70"
            aria-label="Go to homepage"
          >
            <Image
              src="/Logotype.svg"
              alt="AIM"
              width={40}
              height={16}
              priority
            />
          </Link>

          {/* Headline */}
          {headline && (
            <h1
              ref={headlineRef}
              className="text-4xl uppercase leading-[1.1] text-white md:text-5xl"
              style={{ fontFamily: "var(--font-anton), sans-serif" }}
            >
              {headline}
            </h1>
          )}

          {/* Subheadline */}
          {subheadline && (
            <p
              ref={subheadlineRef}
              className="-mt-4 text-base text-white/60"
              style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
            >
              {subheadline}
            </p>
          )}

          {/* Form content slot */}
          <div ref={formRef}>{children}</div>
        </div>
      </div>

      {/* Right side - Video */}
      <div className="relative hidden w-full lg:block lg:w-1/2">
        <BackgroundVideo
          src={videoSrc}
          fallbackSrc="https://assets.mixkit.co/videos/preview/mixkit-man-playing-soccer-502-large.mp4"
          overlay
          overlayOpacity={0.4}
        />
      </div>
    </div>
  );
}
