"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import ContactForm from "./ContactForm";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import StaggerContainer from "@/components/ui/StaggerContainer";
import { DURATION, GSAP_EASE } from "@/lib/animations";

const HEADLINE_PARTS = [
  { text: "REACH OUT", color: "text-[var(--color-brand)]" },
  { text: " TO US TO LEARN MORE ABOUT AIM", color: "text-white" },
];

/**
 * Contact hero section with headline on left, form on right.
 * Full-height section with 50/50 split on desktop.
 */
export default function ContactHero() {
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const headline = headlineRef.current;
    if (!headline) return;

    const chars = headline.querySelectorAll<HTMLElement>(".headline-char");

    gsap.set(chars, {
      opacity: 0,
      y: 25,
      rotateX: -35,
      filter: "blur(3px)",
      transformOrigin: "center bottom",
    });

    gsap.to(chars, {
      opacity: 1,
      y: 0,
      rotateX: 0,
      filter: "blur(0px)",
      duration: DURATION.hero,
      stagger: DURATION.charStagger,
      ease: GSAP_EASE.dramatic,
      delay: 0.2,
    });
  }, []);

  return (
    <section className="relative flex min-h-screen w-full flex-col lg:flex-row">
      {/* Left side - Headline and contact details */}
      <div className="flex w-full flex-col justify-center px-6 py-24 pt-32 lg:w-1/2 lg:px-12 lg:py-0">
        <div className="mx-auto flex w-full max-w-[600px] flex-col gap-6 lg:mx-0">
          {/* Headline with character-level reveal */}
          <h1
            ref={headlineRef}
            className="flex flex-wrap text-5xl uppercase leading-[1.1] md:text-6xl lg:text-7xl"
            style={{ fontFamily: "var(--font-anton), sans-serif", perspective: "1000px" }}
          >
            {HEADLINE_PARTS.map((part, i) => (
              <span key={i} className={part.color}>
                {part.text.split("").map((char, j) => (
                  <span
                    key={`${i}-${j}`}
                    className="headline-char inline-block"
                    style={{ whiteSpace: char === " " ? "pre" : undefined }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </span>
                ))}
              </span>
            ))}
          </h1>

          {/* Decorative divider */}
          <RevealOnScroll delay={0.4}>
            <div className="my-2 h-px w-full bg-gradient-to-r from-[var(--color-brand)] via-white/20 to-transparent" />
          </RevealOnScroll>

          {/* Contact details */}
          <StaggerContainer baseDelay={0.5} staggerDelay={0.1} className="flex flex-col gap-4">
            <RevealOnScroll>
              <ContactDetail label="ADDRESS">
                <p>101 College Street,</p>
                <p>Dripping Springs, TX 78620</p>
              </ContactDetail>
            </RevealOnScroll>
            <RevealOnScroll>
              <ContactDetail label="EMAIL">
                <a
                  href="mailto:support@aim.io"
                  className="transition-colors hover:text-[var(--color-brand)]"
                >
                  support@aim.io
                </a>
              </ContactDetail>
            </RevealOnScroll>
          </StaggerContainer>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex w-full items-center justify-center bg-white/10 px-6 py-16 lg:w-1/2 lg:py-0">
        <RevealOnScroll delay={0.3} direction="right" blur>
          <ContactForm />
        </RevealOnScroll>
      </div>
    </section>
  );
}

/** Reusable contact detail row with label and content. */
function ContactDetail({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex flex-col gap-2 py-3 text-sm uppercase tracking-wide text-white sm:flex-row sm:items-start sm:justify-between"
      style={{ fontFamily: "var(--font-geist-mono), monospace" }}
    >
      <span className="w-full shrink-0 text-white/70 sm:w-1/3">{label}</span>
      <div className="w-full sm:w-2/3">{children}</div>
    </div>
  );
}
