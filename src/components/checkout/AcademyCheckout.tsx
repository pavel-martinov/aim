"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import StepperProgress from "@/components/ui/StepperProgress";
import PayerDetailsStep from "./PayerDetailsStep";
import OrganizationStep from "./OrganizationStep";
import TeamDetailsStep from "./TeamDetailsStep";
import AdditionalInfoStep from "./AdditionalInfoStep";
import PaymentSummary from "./PaymentSummary";
import { cn } from "@/lib/utils";
import {
  CheckoutFormData,
  PayerDetails,
  OrganizationDetails,
  TeamDetails,
  AdditionalInfo,
} from "./types";
import { DRAMATIC_EASE, DURATION } from "@/lib/animations";
import { useAudio } from "@/contexts/AudioContext";

const STEPS = [
  { label: "You" },
  { label: "Org" },
  { label: "Team" },
  { label: "Info" },
  { label: "Pay" },
];

const STEP_TITLES = [
  "Payer Details",
  "Organization",
  "Team Details",
  "Additional Info",
  "Review & Pay",
];

const STEP_SUBTITLES = [
  "Who is subscribing?",
  "Tell us about your academy",
  "Link your AIM team",
  "A few more details",
  "Almost there!",
];

const EMPTY_FORM: CheckoutFormData = {
  payer: { fullName: "", email: "" },
  organization: {
    organizationName: "",
    contactEmail: "",
    contactPhone: "",
  },
  team: {
    teamName: "",
    accountEmail: "",
  },
  additional: {
    hearAboutUs: "",
    hearAboutUsOther: "",
    anythingElse: "",
    agreedToTerms: false,
  },
};

interface AcademyCheckoutProps {
  price: number;
  cycle: "monthly" | "annual";
  students: number;
}

/**
 * Multi-step Academy checkout wizard orchestrator.
 * Manages step navigation, form state, and animated step transitions.
 */
export default function AcademyCheckout({
  price,
  cycle,
  students,
}: AcademyCheckoutProps) {
  const router = useRouter();
  const { pausePlayback } = useAudio();
  const [currentStep, setCurrentStep] = useState(0);
  const [furthestStep, setFurthestStep] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [formData, setFormData] = useState<CheckoutFormData>(EMPTY_FORM);
  const [stepValid, setStepValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const scrollRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStep]);

  // Stop background music while user is in the checkout input flow.
  useEffect(() => {
    pausePlayback();
  }, [pausePlayback]);

  const goNext = () => {
    if (currentStep < STEPS.length - 1) {
      setDirection(1);
      setStepValid(false);
      setCurrentStep((s) => {
        const next = s + 1;
        setFurthestStep((prev) => Math.max(prev, next));
        return next;
      });
    }
  };

  const jumpTo = (index: number) => {
    if (index <= furthestStep && index !== currentStep) {
      setDirection(index < currentStep ? -1 : 1);
      setStepValid(true);
      setCurrentStep(index);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1800));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const isLastStep = currentStep === STEPS.length - 1;

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 60 : -60,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({
      x: dir > 0 ? -60 : 60,
      opacity: 0,
    }),
  };

  if (isSubmitted) {
    return <SuccessScreen name={formData.payer.fullName} email={formData.organization.contactEmail || formData.payer.email} />;
  }

  return (
    <div className="flex h-[100dvh] flex-col bg-black overflow-hidden">
      {/* Top header */}
      <header className="shrink-0 z-30 border-b border-white/10 bg-black/80 px-4 py-4 md:pt-6 md:pb-12 backdrop-blur-md lg:px-8">
        <div className="relative mx-auto flex max-w-5xl items-center justify-between min-h-[40px]">
          {/* AIM logo - far left */}
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

          {/* Wider stepper - absolutely centered */}
          <div className="absolute left-1/2 top-1/2 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 pointer-events-none px-14 md:px-0 hidden md:block">
            <div className="pointer-events-auto">
              <StepperProgress
                steps={STEPS}
                currentStep={currentStep}
                furthestStep={furthestStep}
                onStepClick={jumpTo}
              />
            </div>
          </div>

          {/* Close Button - far right */}
          <div className="shrink-0 z-10 flex justify-end">
            <button
              onClick={() => router.push("/membership")}
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

      {/* Main content - data-lenis-prevent allows native scroll inside Lenis */}
      <main
        ref={scrollRef}
        data-lenis-prevent
        className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden px-4 pb-32 pt-10 lg:px-8"
      >
        <div className="mx-auto w-full max-w-xl">
          {/* Step heading */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={`heading-${currentStep}`}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: DURATION.fast, ease: DRAMATIC_EASE }}
              className="mb-8"
            >
              <p
                className="mb-1 text-xs uppercase tracking-widest text-[var(--color-brand)]"
                style={{ fontFamily: "var(--font-geist-mono), monospace" }}
              >
                Step {currentStep + 1} of {STEPS.length}
              </p>
              <h1
                className="text-[36px] uppercase leading-[0.95] tracking-tight text-white md:text-[48px]"
                style={{ fontFamily: "var(--font-anton), sans-serif" }}
              >
                {STEP_TITLES[currentStep]}
              </h1>
              <p
                className="mt-2 text-sm text-white/40"
                style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
              >
                {STEP_SUBTITLES[currentStep]}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Step content */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={`step-${currentStep}`}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: DURATION.standard, ease: DRAMATIC_EASE }}
            >
              {currentStep === 0 && (
                <PayerDetailsStep
                  data={formData.payer}
                  onChange={(payer: PayerDetails) =>
                    setFormData((f) => ({ ...f, payer }))
                  }
                  onValidChange={setStepValid}
                />
              )}
              {currentStep === 1 && (
                <OrganizationStep
                  data={formData.organization}
                  onChange={(organization: OrganizationDetails) =>
                    setFormData((f) => ({ ...f, organization }))
                  }
                  onValidChange={setStepValid}
                />
              )}
              {currentStep === 2 && (
                <TeamDetailsStep
                  data={formData.team}
                  onChange={(team: TeamDetails) =>
                    setFormData((f) => ({ ...f, team }))
                  }
                  onValidChange={setStepValid}
                />
              )}
              {currentStep === 3 && (
                <AdditionalInfoStep
                  data={formData.additional}
                  onChange={(additional: AdditionalInfo) =>
                    setFormData((f) => ({ ...f, additional }))
                  }
                  onValidChange={setStepValid}
                />
              )}
              {currentStep === 4 && (
                <PaymentSummary
                  data={formData}
                  plan={{ name: "Academies", price, cycle, students }}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Inline Action Button */}
          <motion.div
            className="mt-12 md:mt-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: DURATION.standard, ease: DRAMATIC_EASE }}
          >
            {isLastStep ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={cn(
                  "w-full rounded-xl py-4 text-sm uppercase tracking-widest font-bold",
                  "transition-all duration-[650ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-black",
                  isSubmitting
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
                  "Submit Request"
                )}
              </button>
            ) : (
              <button
                onClick={goNext}
                disabled={!stepValid}
                className={cn(
                  "w-full rounded-xl py-4 text-sm uppercase tracking-widest font-bold",
                  "transition-all duration-[650ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-black",
                  !stepValid
                    ? "cursor-not-allowed bg-white/[0.12] text-white/40"
                    : "bg-[var(--color-brand)] text-black hover:brightness-110 hover:shadow-[0_8px_30px_rgba(36,255,0,0.25)] active:scale-[0.98]"
                )}
                style={{ fontFamily: "var(--font-geist-mono), monospace" }}
              >
                Continue →
              </button>
            )}
          </motion.div>
        </div>
      </main>
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

function SuccessScreen({ name, email }: { name: string; email: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.standard, ease: DRAMATIC_EASE }}
      className="flex min-h-[100dvh] flex-col items-center justify-center gap-6 bg-black px-4 py-20 text-center"
    >
      {/* Checkmark */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-brand)]"
      >
        <svg width="32" height="28" viewBox="0 0 32 28" fill="none">
          <path
            d="M3 14L12 23L29 3"
            stroke="black"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>

      <div className="max-w-sm">
        <h1
          className="text-[48px] uppercase leading-[0.95] tracking-tight text-white"
          style={{ fontFamily: "var(--font-anton), sans-serif" }}
        >
          You&apos;re In!
        </h1>
        <p
          className="mt-4 text-sm leading-relaxed text-white/60"
          style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
        >
          Thanks{name ? `, ${name}` : ""}! Your Academy request has been
          submitted. The AIM team will contact you at{" "}
          <span className="text-white">{email}</span> within 1–2 business days
          to finalize your setup.
        </p>
      </div>

      <Link
        href="/membership"
        className="mt-4 text-xs uppercase tracking-widest text-white/40 underline underline-offset-4 transition-colors hover:text-white"
        style={{ fontFamily: "var(--font-geist-mono), monospace" }}
      >
        Back to Plans
      </Link>
    </motion.div>
  );
}
