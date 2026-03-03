"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { DRAMATIC_EASE, SMOOTH_EASE } from "@/lib/animations";

/** Gallery images - duplicate set for seamless infinite scroll */
const GALLERY_IMAGES = [
  { id: 1, src: "/images/gallery/gallery-1.jpg", alt: "Player with AIM shirt" },
  { id: 2, src: "/images/gallery/gallery-2.jpg", alt: "AIM branded football" },
  { id: 3, src: "/images/gallery/gallery-3.jpg", alt: "Player silhouette with ball" },
  { id: 4, src: "/images/gallery/gallery-4.jpg", alt: "Player juggling" },
  { id: 5, src: "/images/gallery/gallery-5.jpg", alt: "Player in action" },
  { id: 6, src: "/images/gallery/gallery-6.jpg", alt: "AIM jersey detail" },
  { id: 7, src: "/images/gallery/gallery-7.jpg", alt: "AIM merchandise" },
];

/**
 * Gallery section with infinite auto-scrolling carousel.
 * Uses CSS animation for smooth, elegant continuous scroll.
 */
export default function AboutGallery() {
  return (
    <section
      className="relative w-full overflow-hidden bg-white py-16 md:py-24 lg:py-[120px]"
      data-header-theme="light"
    >
      {/* Heading */}
      <div className="mx-auto mb-16 flex max-w-[720px] flex-col items-center px-4 md:mb-24 lg:mb-[120px] lg:px-6">
        <motion.p
          className="text-center text-[28px] font-medium capitalize leading-[1.25] text-black md:text-[36px] lg:text-[52px]"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: DRAMATIC_EASE }}
        >
          Behind every great player is relentless preparation. We&apos;re building the tools to make that preparation world-class — for everyone.
        </motion.p>
      </div>

      {/* Infinite scrolling carousel */}
      <motion.div
        className="relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, ease: SMOOTH_EASE }}
      >
        <div className="gallery-carousel flex w-max gap-3 md:gap-[12px]">
          {/* First set of images */}
          {GALLERY_IMAGES.map((image) => (
            <div
              key={`first-${image.id}`}
              className="relative size-[200px] shrink-0 overflow-hidden md:size-[320px]"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 200px, 320px"
              />
            </div>
          ))}
          {/* Duplicate set for seamless loop */}
          {GALLERY_IMAGES.map((image) => (
            <div
              key={`second-${image.id}`}
              className="relative size-[200px] shrink-0 overflow-hidden md:size-[320px]"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 200px, 320px"
              />
            </div>
          ))}
        </div>
      </motion.div>

      {/* CSS for infinite scroll animation */}
      <style jsx>{`
        .gallery-carousel {
          animation: scroll 40s linear infinite;
        }

        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-200px * 7 - 12px * 7));
          }
        }

        @media (min-width: 768px) {
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(calc(-320px * 7 - 12px * 7));
            }
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .gallery-carousel {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
