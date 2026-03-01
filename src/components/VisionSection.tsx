"use client";

import { useRef, useLayoutEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Vision slide data */
const SLIDES = [
  {
    id: 1,
    text: "Is to solve the worldwide issue of limited access to elite football coaching and propel the development of grassroots football.",
    image: "/images/steps/begin.jpg",
  },
  {
    id: 2,
    text: "To democratise elite coaching through AI, making professional-level guidance accessible to every aspiring footballer.",
    image: "/images/steps/record.jpg",
  },
  {
    id: 3,
    text: "To transform raw talent into refined skill, one personalised insight at a time.",
    image: "/images/steps/analyse.jpg",
  },
];

const isMobile = () => typeof window !== "undefined" && window.innerWidth < 768;

/**
 * Full-screen vision section with GSAP ScrollTrigger pinning.
 * Cycles through 3 slides with animated text and progress stepper.
 */
export default function VisionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const fixedContentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const mobile = isMobile();

    const ctx = gsap.context(() => {
      const master = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${mobile ? 3000 : 6000}`,
          scrub: mobile ? 0.3 : true,
          pin: fixedContentRef.current,
          anticipatePin: 1,
          fastScrollEnd: true,
          invalidateOnRefresh: true,
        },
      });

      const blurIn = "blur(18px)";
      const blurOut = "blur(14px)";

      /** Animate text with 3D perspective effect */
      function animateTextIn(selector: string) {
        master.fromTo(
          `${selector} .vision-line`,
          {
            opacity: 0,
            yPercent: 30,
            z: -150,
            rotateX: 8,
            filter: blurIn,
          },
          {
            opacity: 1,
            yPercent: 0,
            z: 0,
            rotateX: 0,
            filter: "blur(0px)",
            duration: 4,
            ease: "power3.out",
          },
          "<"
        );
      }

      function animateTextOut(selector: string) {
        master.to(
          `${selector} .vision-line`,
          {
            opacity: 0,
            yPercent: -30,
            z: -200,
            rotateX: -8,
            filter: blurOut,
            duration: 3,
            ease: "power3.in",
          },
          ">1.5"
        );
      }

      // Slide 1
      master.to(".vision-text-1", { opacity: 1, y: 0, duration: 0.3, ease: "none" });
      animateTextIn(".vision-text-1");
      master.fromTo(".progress-1", { width: "0%" }, { width: "100%", ease: "none", duration: 4 }, "<");
      master.to(".vision-bg-1", { opacity: 1, duration: 0.2 }, "<");
      animateTextOut(".vision-text-1");
      master.to(".vision-text-1", { opacity: 0, y: -20, duration: 0.3, ease: "none" });

      // Slide 2
      master.to(".vision-text-2", { opacity: 1, y: 0, duration: 0.3, ease: "none" });
      master.to(".vision-bg-1", { opacity: 0, duration: 0.5 }, "<");
      master.to(".vision-bg-2", { opacity: 1, duration: 0.5 }, "<");
      animateTextIn(".vision-text-2");
      master.fromTo(".progress-2", { width: "0%" }, { width: "100%", ease: "none", duration: 4 }, "<");
      animateTextOut(".vision-text-2");
      master.to(".vision-text-2", { opacity: 0, y: -20, duration: 0.3, ease: "none" });

      // Slide 3
      master.to(".vision-text-3", { opacity: 1, y: 0, duration: 0.3, ease: "none" });
      master.to(".vision-bg-2", { opacity: 0, duration: 0.5 }, "<");
      master.to(".vision-bg-3", { opacity: 1, duration: 0.5 }, "<");
      animateTextIn(".vision-text-3");
      master.fromTo(".progress-3", { width: "0%" }, { width: "100%", ease: "none", duration: 4 }, "<");
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Our Vision"
      className="vision-section relative bg-[#0a0a0a]"
      data-header-theme="dark"
    >
      {/* Pinned content container */}
      <div
        ref={fixedContentRef}
        className="relative flex h-screen w-full flex-col items-center justify-center px-4 py-[60px] lg:px-6"
      >
        {/* Background images */}
        <div className="absolute inset-0 overflow-hidden">
          {SLIDES.map((slide, index) => (
            <div
              key={slide.id}
              className={`vision-bg-${index + 1} absolute inset-0`}
              style={{ opacity: index === 0 ? 1 : 0 }}
            >
              <Image
                src={slide.image}
                alt=""
                fill
                className="object-cover"
                sizes="100vw"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-black/30" />
            </div>
          ))}
        </div>

        {/* Text slides */}
        <div className="relative z-10 w-full max-w-[740px]" style={{ perspective: "1000px" }}>
          {SLIDES.map((slide, index) => (
            <div
              key={slide.id}
              className={`vision-text-${index + 1} absolute inset-0 flex items-center justify-center`}
              style={{ opacity: index === 0 ? 1 : 0 }}
            >
              <p
                className="vision-line text-center text-[36px] font-medium capitalize leading-[1.25] text-white lg:text-[52px]"
                style={{
                  fontFamily: "var(--font-geist-sans), sans-serif",
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                  willChange: "transform, opacity, filter",
                }}
              >
                {slide.text}
              </p>
            </div>
          ))}
        </div>

        {/* Progress stepper */}
        <div className="absolute bottom-[60px] left-4 right-4 z-10 flex h-px gap-[6px] md:bottom-[24px] md:left-1/2 md:right-auto md:w-full md:max-w-[720px] md:-translate-x-1/2">
          {SLIDES.map((slide, index) => (
            <div key={slide.id} className="relative h-full flex-1">
              <div className="absolute inset-0 bg-white/50" />
              <div
                className={`progress-${index + 1} absolute left-0 top-0 h-full bg-white`}
                style={{ width: "0%", transformOrigin: "left center" }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
