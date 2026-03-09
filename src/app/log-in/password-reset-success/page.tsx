"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import OpaqueButton from "@/components/ui/OpaqueButton";
import BackgroundVideo from "@/components/ui/BackgroundVideo";
import { DURATION, GSAP_EASE } from "@/lib/animations";

export default function PasswordResetSuccessPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: GSAP_EASE.dramatic } });

      if (logoRef.current) {
        gsap.set(logoRef.current, { opacity: 0, y: -20 });
        tl.to(logoRef.current, { opacity: 1, y: 0, duration: DURATION.standard }, 0);
      }

      if (iconRef.current) {
        gsap.set(iconRef.current, { opacity: 0, scale: 0.5 });
        tl.to(iconRef.current, { opacity: 1, scale: 1, duration: DURATION.hero, ease: "back.out(1.4)" }, 0.2);
      }

      if (headlineRef.current) {
        gsap.set(headlineRef.current, { opacity: 0, y: 30 });
        tl.to(headlineRef.current, { opacity: 1, y: 0, duration: DURATION.standard }, 0.4);
      }

      if (textRef.current) {
        gsap.set(textRef.current, { opacity: 0, y: 20 });
        tl.to(textRef.current, { opacity: 1, y: 0, duration: DURATION.standard }, 0.5);
      }

      if (buttonRef.current) {
        gsap.set(buttonRef.current, { opacity: 0, y: 20 });
        tl.to(buttonRef.current, { opacity: 1, y: 0, duration: DURATION.standard }, 0.6);
      }

      const checkPath = iconRef.current?.querySelector(".check-path");
      if (checkPath) {
        gsap.set(checkPath, { strokeDasharray: 30, strokeDashoffset: 30 });
        tl.to(checkPath, { strokeDashoffset: 0, duration: 0.6, ease: "power2.out" }, 0.6);
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative flex min-h-screen w-full flex-col lg:flex-row">
      {/* Left side - Success content */}
      <div className="flex w-full flex-col justify-center px-6 py-16 lg:w-1/2 lg:px-16 xl:px-24">
        <div className="mx-auto flex w-full max-w-[400px] flex-col gap-8 lg:mx-0">
          {/* Logo */}
          <Link
            ref={logoRef}
            href="/"
            className="mb-4 inline-block w-fit transition-opacity duration-300 hover:opacity-70"
            aria-label="Go to homepage"
          >
            <Image
              src="/Logotype.svg"
              alt="AIM"
              width={80}
              height={32}
              priority
            />
          </Link>

          {/* Success icon */}
          <div
            ref={iconRef}
            className="flex size-20 items-center justify-center rounded-full bg-[var(--color-brand)]/20"
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              className="text-[var(--color-brand)]"
            >
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
              <path
                className="check-path"
                d="M9 12l2 2 4-4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Headline */}
          <h1
            ref={headlineRef}
            className="text-4xl uppercase leading-[1.1] text-white md:text-5xl"
            style={{ fontFamily: "var(--font-anton), sans-serif" }}
          >
            Password Reset
            <br />
            <span className="text-[var(--color-brand)]">Successful</span>
          </h1>

          {/* Description */}
          <p
            ref={textRef}
            className="text-base text-white/60"
            style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
          >
            Your password has been successfully updated. You can now log in with your new password.
          </p>

          {/* Back to login button */}
          <div ref={buttonRef}>
            <OpaqueButton href="/log-in" variant="brand">
              Back to Login
            </OpaqueButton>
          </div>
        </div>
      </div>

      {/* Right side - Video */}
      <div className="relative hidden w-full lg:block lg:w-1/2">
        <BackgroundVideo
          src="/images/vision/Vision-1.mp4"
          overlay
          overlayOpacity={0.4}
        />
      </div>
    </div>
  );
}
