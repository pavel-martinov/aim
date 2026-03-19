"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ContactDetailsStep from "./ContactDetailsStep";
import { cn } from "@/lib/utils";
import { CheckoutFormData, ContactDetails } from "./types";
import { DRAMATIC_EASE, DURATION } from "@/lib/animations";

const EMPTY_FORM: CheckoutFormData = {
  contact: {
    fullName: "",
    email: "",
    organizationName: "",
    mobileNumber: "",
    hearAboutUs: "",
    hearAboutUsOther: "",
    comment: "",
    agreedToTerms: false,
  },
};

/**
 * Academy interest registration — single-step full-screen form with success confirmation.
 * Collects contact details, then displays a success message instead of billing.
 */
export default function AcademyCheckout() {
  const router = useRouter();
  const [formData, setFormData] = useState<CheckoutFormData>(EMPTY_FORM);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const scrollRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [isSubmitted]);

  const handleSubmit = async () => {
    if (!isFormValid) return;
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const variants = {
    enter: { opacity: 0, y: 20 },
    center: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div className="flex h-[100dvh] flex-col bg-black overflow-hidden">
      {/* Header */}
      <header className="shrink-0 z-30 border-b border-white/10 bg-black/80 px-4 py-4 md:py-6 backdrop-blur-md lg:px-8">
        <div className="relative mx-auto flex max-w-5xl items-center justify-between min-h-[40px]">
          <Link
            href="/home"
            className="shrink-0 transition-opacity hover:opacity-80 flex items-center z-10"
            aria-label="AIM home"
          >
            <Image
              src="/Logotype.svg"
              alt="AIM"
              width={23}
              height={26}
              className="h-7 w-auto"
            />
          </Link>

          <div className="shrink-0 z-10 flex justify-end">
            <button
              onClick={() => router.back()}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/60 transition-all duration-300 hover:border-white/50 hover:text-white"
              aria-label="Close"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M4 4l8 8M12 4l-8 8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main
        ref={scrollRef}
        data-lenis-prevent
        className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden px-4 pb-6 pt-10 lg:px-8"
      >
        <div className="mx-auto w-full max-w-xl">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                key="form"
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: DURATION.fast, ease: DRAMATIC_EASE }}
              >
                {/* Heading */}
                <div className="mb-8">
                  <p
                    className="mb-1 text-xs uppercase tracking-widest text-[var(--color-brand)]"
                    style={{ fontFamily: "var(--font-geist-mono), monospace" }}
                  >
                    Academies
                  </p>
                  <h1
                    className="text-[36px] uppercase leading-[0.95] tracking-tight text-white md:text-[48px]"
                    style={{ fontFamily: "var(--font-anton), sans-serif" }}
                  >
                    Register Interest
                  </h1>
                  <p
                    className="mt-2 text-sm text-white/40"
                    style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
                  >
                    Tell us about yourself and your academy
                  </p>
                </div>

                {/* Form */}
                <ContactDetailsStep
                  data={formData.contact}
                  onChange={(contact: ContactDetails) =>
                    setFormData((f) => ({ ...f, contact }))
                  }
                  onValidChange={setIsFormValid}
                />
              </motion.div>
            ) : (
              <motion.div
                key="success"
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: DURATION.standard, ease: DRAMATIC_EASE }}
                className="flex flex-col items-center py-16 text-center"
              >
                {/* Success icon */}
                <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-[var(--color-brand)]/15">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="none"
                    className="text-[var(--color-brand)]"
                  >
                    <path
                      d="M10 20l8 8 12-14"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <h1
                  className="mb-3 text-[36px] uppercase leading-[0.95] tracking-tight text-white md:text-[48px]"
                  style={{ fontFamily: "var(--font-anton), sans-serif" }}
                >
                  Interest Received!
                </h1>
                <p
                  className="mb-8 max-w-md text-base leading-relaxed text-white/60"
                  style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
                >
                  We have successfully received your interest. Our team will be in touch with you soon at{" "}
                  <span className="text-white">{formData.contact.email}</span>.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Sticky footer */}
      <motion.div
        className="shrink-0 z-20 border-t border-white/10 bg-gradient-to-t from-black via-black to-black/80 px-4 py-3 lg:px-8"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.standard, ease: DRAMATIC_EASE }}
      >
        <div className="mx-auto w-full max-w-xl">
          {!isSubmitted ? (
            <button
              onClick={handleSubmit}
              disabled={!isFormValid || isSubmitting}
              className={cn(
                "w-full rounded-xl py-3.5 text-sm uppercase tracking-widest font-bold",
                "transition-all duration-[650ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-black",
                !isFormValid || isSubmitting
                  ? "cursor-not-allowed bg-white/[0.12] text-white/40"
                  : "bg-[var(--color-brand)] text-black hover:brightness-110 hover:shadow-[0_8px_30px_rgba(36,255,0,0.25)] active:scale-[0.98]"
              )}
              style={{ fontFamily: "var(--font-geist-mono), monospace" }}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <LoadingSpinner />
                  Submitting...
                </span>
              ) : (
                "Submit Interest"
              )}
            </button>
          ) : (
            <button
              onClick={() => router.push("/")}
              className={cn(
                "w-full rounded-xl py-3.5 text-sm uppercase tracking-widest font-bold",
                "transition-all duration-[650ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-black",
                "bg-[var(--color-brand)] text-black hover:brightness-110 hover:shadow-[0_8px_30px_rgba(36,255,0,0.25)] active:scale-[0.98]"
              )}
              style={{ fontFamily: "var(--font-geist-mono), monospace" }}
            >
              Back to Home
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" className="opacity-25" />
      <path d="M4 12a8 8 0 018-8" className="opacity-75" strokeLinecap="round" />
    </svg>
  );
}
