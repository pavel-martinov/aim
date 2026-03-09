"use client";

import { useRef, useEffect, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DURATION, GSAP_EASE } from "@/lib/animations";

gsap.registerPlugin(ScrollTrigger);

type TextRevealProps = {
  children: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  /** Split by "char" (characters), "word", or "line" (newlines) */
  splitBy?: "char" | "word" | "line";
  /** Delay before animation starts */
  delay?: number;
  /** Use longer duration for hero text */
  dramatic?: boolean;
  /** Trigger on scroll intersection (default) or immediately on mount */
  trigger?: "scroll" | "mount";
};

/** Splits text into characters, preserving spaces as separate elements */
function splitIntoChars(text: string): string[] {
  return text.split("");
}

/** Splits text into words, preserving spaces */
function splitIntoWords(text: string): string[] {
  return text.split(/(\s+)/).filter(Boolean);
}

/** Splits text by newlines */
function splitIntoLines(text: string): string[] {
  return text.split("\n").filter(Boolean);
}

/**
 * Premium text reveal with character/word-level animation.
 * Uses GSAP for organic, wave-like staggered reveals with blur and 3D rotation.
 */
export default function TextReveal({
  children,
  className,
  as: Tag = "h1",
  splitBy = "char",
  delay = 0,
  dramatic = false,
  trigger = "scroll",
}: TextRevealProps) {
  const containerRef = useRef<HTMLElement>(null);
  const hasAnimated = useRef(false);

  const elements = useMemo(() => {
    switch (splitBy) {
      case "char":
        return splitIntoChars(children);
      case "word":
        return splitIntoWords(children);
      case "line":
        return splitIntoLines(children);
    }
  }, [children, splitBy]);

  const staggerDelay =
    splitBy === "char"
      ? DURATION.charStagger
      : splitBy === "word"
        ? DURATION.wordStagger
        : 0.12;

  const baseDuration = dramatic ? DURATION.hero : 0.8;

  useEffect(() => {
    const container = containerRef.current;
    if (!container || hasAnimated.current) return;

    const chars = container.querySelectorAll<HTMLElement>(".reveal-element");
    if (!chars.length) return;

    gsap.set(chars, {
      opacity: 0,
      y: splitBy === "line" ? 40 : 20,
      rotateX: splitBy === "char" ? -40 : -20,
      filter: "blur(4px)",
      transformOrigin: "center bottom",
    });

    const animate = () => {
      if (hasAnimated.current) return;
      hasAnimated.current = true;

      gsap.to(chars, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        filter: "blur(0px)",
        duration: baseDuration,
        stagger: staggerDelay,
        ease: GSAP_EASE.dramatic,
        delay,
      });
    };

    if (trigger === "mount") {
      animate();
    } else {
      ScrollTrigger.create({
        trigger: container,
        start: "top 85%",
        once: true,
        onEnter: animate,
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === container) st.kill();
      });
    };
  }, [baseDuration, staggerDelay, delay, trigger, splitBy]);

  const isInlineElement = splitBy === "char" || splitBy === "word";

  return (
    <Tag ref={containerRef as React.RefObject<HTMLHeadingElement>} className={className} style={{ perspective: "1000px" }}>
      {elements.map((el, i) => {
        const isSpace = el === " " || /^\s+$/.test(el);

        if (isSpace && splitBy === "char") {
          return <span key={i}>&nbsp;</span>;
        }

        return (
          <span
            key={i}
            className={`reveal-element ${isInlineElement ? "inline-block" : "block"}`}
            style={{
              whiteSpace: isSpace ? "pre" : undefined,
              willChange: "transform, opacity, filter",
            }}
          >
            {el}
          </span>
        );
      })}
    </Tag>
  );
}
