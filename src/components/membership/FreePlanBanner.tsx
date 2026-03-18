"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import OpaqueButton from "@/components/ui/OpaqueButton";
import CheckIcon from "@/components/ui/CheckIcon";
import { DRAMATIC_EASE, DURATION } from "@/lib/animations";

const FREE_FEATURES = [
  "Level 1 Drills",
  "3 Uploads / Week",
  "Basic AI Scoring",
  "Community XP",
];

/** Free plan banner with dark background image and feature highlights */
export default function FreePlanBanner() {
  const router = useRouter();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.fast, ease: DRAMATIC_EASE }}
      className="relative w-full overflow-hidden rounded-[24px] bg-[#080808] p-5 sm:p-6 lg:rounded-[32px] lg:p-10 mb-6 sm:mb-8 lg:mb-12 text-left"
    >
      {/* Background image with dark overlay */}
      <div className="absolute inset-0">
        <Image
          src="/images/gallery/gallery-1.jpg"
          alt=""
          fill
          className="object-cover grayscale opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50" />
      </div>
      
      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-4 max-w-2xl">
          <h2 
            className="text-[28px] font-medium capitalize leading-[1.15] text-white sm:text-[36px] lg:text-[46px]"
            style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
          >
            Start Free, No Credit Card Needed
          </h2>
          <p 
            className="text-sm text-white/70 sm:text-base max-w-xl"
            style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
          >
            Best for individuals starting with their training and development journey. 
            Get access to core features and begin improving today.
          </p>
          
          {/* Feature ticks */}
          <div className="hidden md:flex flex-wrap gap-x-6 gap-y-2 mt-2">
            {FREE_FEATURES.map((feature) => (
              <div 
                key={feature}
                className="flex items-center gap-2"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-brand)]">
                  <CheckIcon size={12} className="text-black" />
                </span>
                <span 
                  className="text-xs sm:text-sm text-white/80 uppercase tracking-wide"
                  style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
                >
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex w-full lg:w-auto items-center mt-4 lg:mt-0">
          <OpaqueButton
            variant="brand"
            onClick={() => router.push("/membership/checkout?plan=starter")}
            className="!w-full lg:!w-auto !h-auto !flex-row !justify-center !py-2.5 sm:!py-3 lg:!px-8 lg:!py-4 text-xs sm:text-sm lg:text-base whitespace-nowrap"
            showIcon={false}
          >
            Sign up free
          </OpaqueButton>
        </div>
      </div>
    </motion.div>
  );
}
