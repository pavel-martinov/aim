"use client";

import Image from "next/image";
import { useRef, useEffect, useCallback } from "react";
import OpaqueButton from "@/components/ui/OpaqueButton";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import { openDownloadStore } from "@/lib/download";

/** Product card data for carousel */
const PRODUCTS = [
  {
    title: "Data Analysis",
    description:
      "Monitor your every move with precise, frame-by-frame analysis. Our AI provides real-time insights into your speed, technique, and control.",
    image: "/images/data-analysis.jpg",
    overlayOpacity: 0.32,
  },
  {
    title: "Progress Tracking",
    description:
      "Turn raw performance data into clear visuals. Discover your strengths, weaknesses, and progress over time with sleek, interactive charts that keep you focused on growth.",
    image: "/images/progress-tracking.jpg",
    overlayOpacity: 0.52,
  },
  {
    title: "Tailored Insights",
    description:
      "Review your training sessions, note key insights, and celebrate achievements. The journal helps you stay mentally sharp and emotionally engaged in your growth.",
    image: "/images/tailored-insights.jpg",
    overlayOpacity: 0,
  },
  {
    title: "Goals & Milestones",
    description:
      "Set clear, personalised targets and track your journey towards them. From micro-goals to major breakthroughs, AIM helps you stay motivated and accountable with structured progress checkpoints.",
    image: "/images/goals-milestones.jpg",
    overlayOpacity: 0.52,
  },
];

/** Layout constants for desktop carousel */
const CARD_WIDTH = 580;
const GAP = 12;
const LEFT_PADDING = 24;
const CARD_STEP = CARD_WIDTH + GAP;

/** Auto-scroll speed in pixels per second */
const SCROLL_SPEED = 100;

/** Simplified product card with background image, title, and description */
function ProductCard({
  title,
  description,
  image,
  overlayOpacity,
}: {
  title: string;
  description: string;
  image: string;
  overlayOpacity: number;
}) {
  return (
    <div className="relative flex h-[500px] w-[320px] flex-shrink-0 select-none flex-col overflow-hidden rounded-[24px] md:h-[520px] md:w-[467px] lg:h-[646px] lg:w-[580px]">
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 320px, (max-width: 1024px) 467px, 580px"
        draggable={false}
      />
      {overlayOpacity > 0 && (
        <div
          className="absolute inset-0 rounded-[24px]"
          style={{ backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})` }}
        />
      )}
      <div className="relative z-10 flex flex-col gap-4 p-6 md:p-10 lg:p-12">
        <h3 className="text-2xl font-semibold leading-[1.25] text-white md:text-[32px] lg:text-[40px]">
          {title}
        </h3>
        <p className="text-sm font-normal uppercase leading-[1.5] text-white md:text-[13px] lg:text-base">
          {description}
        </p>
      </div>
    </div>
  );
}

/**
 * Desktop carousel with auto-scroll and drag support.
 * Uses scrollLeft for seamless looping and snap-to-card on interaction end.
 */
function DesktopCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const scrollStartX = useRef(0);
  const lastTime = useRef(0);

  /** Half the total scroll width (first set of cards) for seamless loop reset */
  const halfWidth = PRODUCTS.length * CARD_STEP;

  /** Snap to nearest card after interaction, clamped to 24px anchor minimum */
  const snapToCard = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const adjusted = el.scrollLeft - LEFT_PADDING;
    const rawTarget = Math.round(adjusted / CARD_STEP) * CARD_STEP + LEFT_PADDING;
    const target = Math.max(rawTarget, LEFT_PADDING);
    el.scrollTo({ left: target, behavior: "smooth" });
  }, []);

  /** Animation loop for auto-scroll */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reducedMotion) return;

    let rafId: number;

    const tick = (time: number) => {
      if (lastTime.current === 0) lastTime.current = time;
      const delta = (time - lastTime.current) / 1000;
      lastTime.current = time;

      if (!isDragging.current) {
        el.scrollLeft += SCROLL_SPEED * delta;
        if (el.scrollLeft >= halfWidth) {
          el.scrollLeft -= halfWidth;
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [halfWidth]);

  /** Drag handlers */
  const onPointerDown = (e: React.PointerEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    isDragging.current = true;
    dragStartX.current = e.clientX;
    scrollStartX.current = el.scrollLeft;
    el.setPointerCapture(e.pointerId);
    el.style.cursor = "grabbing";
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const el = scrollRef.current;
    if (!el) return;
    const dx = dragStartX.current - e.clientX;
    el.scrollLeft = scrollStartX.current + dx;
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const el = scrollRef.current;
    if (!el) return;
    el.releasePointerCapture(e.pointerId);
    el.style.cursor = "grab";
    snapToCard();
  };

  return (
    <div className="relative left-1/2 mt-[60px] hidden w-screen -translate-x-1/2 overflow-hidden lg:block">
      <div
        ref={scrollRef}
        className="mission-desktop-carousel flex cursor-grab gap-3 overflow-x-scroll pl-6"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {PRODUCTS.map((product) => (
          <ProductCard key={`first-${product.title}`} {...product} />
        ))}
        {PRODUCTS.map((product) => (
          <ProductCard key={`second-${product.title}`} {...product} />
        ))}
      </div>
    </div>
  );
}

/**
 * Mission section with centered header and product cards.
 * Mobile: Touch-swipeable horizontal scroll with snap.
 * Desktop: Auto-scrolling infinite carousel with drag support.
 */
export default function MissionSection() {
  return (
    <section
      aria-label="Our Mission"
      className="relative bg-white py-[60px]"
      data-header-theme="light"
    >
      <div className="mx-auto flex max-w-[696px] flex-col items-center gap-6 px-4 text-center lg:px-6">
        <RevealOnScroll dramatic>
          <h2 className="text-4xl font-medium capitalize leading-[1.25] text-black lg:text-[46px]">
            Building The World&apos;s Most Intelligent Training System.
          </h2>
        </RevealOnScroll>

        <RevealOnScroll delay={0.1}>
          <p className="max-w-[516px] text-sm font-normal uppercase leading-[1.5] text-black lg:text-base">
            AIM isn&apos;t just about improvement, it&apos;s about evolution. We
            believe elite coaching should be available to anyone with a ball, a
            dream, and a desire to be better.
          </p>
        </RevealOnScroll>

        <RevealOnScroll delay={0.2} className="w-full md:w-auto">
          <OpaqueButton onClick={openDownloadStore}>Download Now</OpaqueButton>
        </RevealOnScroll>
      </div>

      {/* Mobile/Tablet: Touch-swipeable horizontal scroll with snap */}
      <RevealOnScroll delay={0.3} viewportAmount={0.1}>
        <div className="mission-carousel mt-[60px] flex gap-3 overflow-x-auto px-4 lg:hidden">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.title} {...product} />
          ))}
        </div>
      </RevealOnScroll>

      {/* Desktop: Auto-scrolling carousel with drag support */}
      <RevealOnScroll delay={0.3} viewportAmount={0.1}>
        <DesktopCarousel />
      </RevealOnScroll>
    </section>
  );
}
