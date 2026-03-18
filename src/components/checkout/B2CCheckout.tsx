"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FormInput from "@/components/ui/FormInput";
import FormCheckbox from "@/components/ui/FormCheckbox";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import CheckoutHeader from "./CheckoutHeader";
import { cn } from "@/lib/utils";
import { DRAMATIC_EASE, DURATION } from "@/lib/animations";
import { EXTERNAL_URLS } from "@/lib/mockAuth";
import { validateEmail, validateLettersOnly, validatePhone } from "@/lib/validation";
import { PLAN_INFO, type PlanId, type BillingCycle, getPlanPrice } from "@/lib/constants";
import { useCurrency } from "@/lib/context/CurrencyContext";

interface B2CCheckoutProps {
  plan: PlanId;
  cycle: BillingCycle;
}

interface FormData {
  fullName: string;
  email: string;
  mobileNumber: string;
  agreedToTerms: boolean;
}

type Errors = Partial<Record<keyof FormData, string>>;
type Touched = Partial<Record<keyof FormData, boolean>>;

/**
 * Simplified B2C checkout for Starter/Pro/Pathway plans.
 * Single-step form with basic contact info and terms agreement.
 */
export default function B2CCheckout({ plan, cycle }: B2CCheckoutProps) {
  const scrollRef = useRef<HTMLElement>(null);
  const { currency, formatPrice } = useCurrency();
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    mobileNumber: "",
    agreedToTerms: false,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Touched>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const planInfo = PLAN_INFO[plan];
  const price = getPlanPrice(plan, cycle, currency);
  const isFree = price === null;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  const validate = useCallback((d: FormData): Errors => {
    const errs: Errors = {
      fullName: validateLettersOnly(d.fullName, "Full name"),
      email: validateEmail(d.email),
    };
    if (!isFree && d.mobileNumber) {
      errs.mobileNumber = validatePhone(d.mobileNumber);
    }
    if (!d.agreedToTerms) {
      errs.agreedToTerms = "You must agree to the terms to continue";
    }
    return errs;
  }, [isFree]);

  const handleChange = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    const errs = validate(updated);
    setErrors(errs);
  };

  const handleBlur = (field: keyof FormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const isFieldValid = (field: keyof FormData) => {
    if (field === "mobileNumber" && isFree) return !!formData[field];
    return touched[field] && !errors[field] && !!formData[field];
  };

  const isFormValid = () => {
    const errs = validate(formData);
    return !Object.values(errs).some(Boolean);
  };

  const handleSubmit = async () => {
    setTouched({ fullName: true, email: true, mobileNumber: true, agreedToTerms: true });
    if (!isFormValid()) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    window.location.href = EXTERNAL_URLS.coachPortal;
  };

  return (
    <div className="flex h-[100dvh] flex-col bg-black overflow-hidden">
      <CheckoutHeader />

      {/* Main content */}
      <main
        ref={scrollRef}
        data-lenis-prevent
        className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden px-4 pb-6 pt-10 lg:px-8"
      >
        <div className="mx-auto w-full max-w-xl">
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.fast, ease: DRAMATIC_EASE }}
            className="mb-8"
          >
            <p
              className="mb-1 text-xs uppercase tracking-widest text-[var(--color-brand)]"
              style={{ fontFamily: "var(--font-geist-mono), monospace" }}
            >
              Checkout
            </p>
            <h1
              className="text-[36px] uppercase leading-[0.95] tracking-tight text-white md:text-[48px]"
              style={{ fontFamily: "var(--font-anton), sans-serif" }}
            >
              {planInfo.name} Plan
            </h1>
            <p
              className="mt-2 text-sm text-white/40"
              style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
            >
              {isFree ? "Get started for free" : `${formatPrice(price)}/${cycle === "annual" ? "mo (billed annually)" : "mo"}`}
            </p>
          </motion.div>

          {/* Plan summary card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.fast, ease: DRAMATIC_EASE, delay: 0.05 }}
            className="mb-8 rounded-xl border border-white/10 bg-white/[0.02] p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white" style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}>
                  {planInfo.name}
                </p>
                <p className="text-xs text-white/50" style={{ fontFamily: "var(--font-geist-mono), monospace" }}>
                  {planInfo.tagline} · {cycle === "annual" ? "Annual" : "Monthly"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-anton), sans-serif" }}>
                  {isFree ? "FREE" : formatPrice(price)}
                </p>
                {!isFree && (
                  <p className="text-xs text-white/40" style={{ fontFamily: "var(--font-geist-mono), monospace" }}>
                    /month
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: DURATION.standard, ease: DRAMATIC_EASE, delay: 0.1 }}
              className="flex flex-col gap-6"
            >
              <FormInput
                label="Full Name"
                placeholder="e.g. Jordan Smith"
                value={formData.fullName}
                onChange={(v) => handleChange("fullName", v)}
                onBlur={() => handleBlur("fullName")}
                error={touched.fullName ? errors.fullName : undefined}
                isValid={isFieldValid("fullName")}
                lettersOnly
                required
                autoComplete="name"
              />

              <FormInput
                label="Email Address"
                placeholder="e.g. jordan@example.com"
                type="email"
                value={formData.email}
                onChange={(v) => handleChange("email", v)}
                onBlur={() => handleBlur("email")}
                error={touched.email ? errors.email : undefined}
                isValid={isFieldValid("email")}
                required
                autoComplete="email"
              />

              <FormInput
                label="Mobile Number"
                placeholder="e.g. +1 555 000 1234"
                type="tel"
                value={formData.mobileNumber}
                onChange={(v) => handleChange("mobileNumber", v)}
                onBlur={() => handleBlur("mobileNumber")}
                error={touched.mobileNumber ? errors.mobileNumber : undefined}
                isValid={isFieldValid("mobileNumber")}
                hint={isFree ? "Optional" : undefined}
                required={!isFree}
                autoComplete="tel"
              />

              {!isFree && (
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                  <p
                    className="mb-3 text-xs uppercase tracking-widest text-white/40"
                    style={{ fontFamily: "var(--font-geist-mono), monospace" }}
                  >
                    Payment Method
                  </p>
                  <div className="flex items-center gap-4 rounded-lg border border-dashed border-white/20 px-4 py-4 bg-black/20">
                    <div className="flex h-10 w-14 items-center justify-center rounded border border-white/10 bg-white/5">
                      <svg
                        width="24"
                        height="18"
                        viewBox="0 0 24 18"
                        fill="none"
                        className="text-white/40"
                      >
                        <rect
                          x="0.75"
                          y="0.75"
                          width="22.5"
                          height="16.5"
                          rx="2.25"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <rect x="0" y="4" width="24" height="4" fill="currentColor" opacity="0.3" />
                        <rect x="3" y="11" width="6" height="2" rx="1" fill="currentColor" opacity="0.5" />
                      </svg>
                    </div>
                    <div>
                      <p
                        className="text-sm text-white/60"
                        style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
                      >
                        Payment integration coming soon
                      </p>
                      <p
                        className="mt-0.5 text-xs text-white/30"
                        style={{ fontFamily: "var(--font-geist-mono), monospace" }}
                      >
                        You won't be charged today
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="border-t border-white/10 pt-4">
                <FormCheckbox
                  checked={formData.agreedToTerms}
                  onChange={(v) => handleChange("agreedToTerms", v)}
                  onBlur={() => handleBlur("agreedToTerms")}
                  error={touched.agreedToTerms ? errors.agreedToTerms : undefined}
                  label={
                    <span>
                      I agree to the{" "}
                      <a
                        href="/terms"
                        target="_blank"
                        className="text-[var(--color-brand)] underline underline-offset-2 hover:opacity-80 transition-opacity"
                      >
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a
                        href="/privacy"
                        target="_blank"
                        className="text-[var(--color-brand)] underline underline-offset-2 hover:opacity-80 transition-opacity"
                      >
                        Privacy Policy
                      </a>
                    </span>
                  }
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Sticky action footer */}
      <motion.div
        className="shrink-0 z-20 border-t border-white/10 bg-gradient-to-t from-black via-black to-black/80 px-4 py-3 lg:px-8"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.standard, ease: DRAMATIC_EASE }}
      >
        <div className="mx-auto w-full max-w-xl">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={cn(
              "w-full rounded-xl py-3.5 text-sm uppercase tracking-widest font-bold",
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
                Processing...
              </span>
            ) : isFree ? (
              "Get Started"
            ) : (
              "Start Free Trial"
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
