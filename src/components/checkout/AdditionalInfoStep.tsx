"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import FormSelect from "@/components/ui/FormSelect";
import FormInput from "@/components/ui/FormInput";
import FormTextarea from "@/components/ui/FormTextarea";
import FormCheckbox from "@/components/ui/FormCheckbox";
import { AdditionalInfo, HEAR_ABOUT_US_OPTIONS } from "./types";

interface AdditionalInfoStepProps {
  data: AdditionalInfo;
  onChange: (data: AdditionalInfo) => void;
  onValidChange: (valid: boolean) => void;
}

type Errors = Partial<Record<keyof AdditionalInfo, string>>;
type Touched = Partial<Record<keyof AdditionalInfo, boolean>>;

/**
 * Step 4 - Additional Info: discovery source, extra notes, terms agreement.
 */
export default function AdditionalInfoStep({
  data,
  onChange,
  onValidChange,
}: AdditionalInfoStepProps) {
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Touched>({});

  const validate = useCallback((d: AdditionalInfo): Errors => {
    const errs: Errors = {};
    if (!d.hearAboutUs) errs.hearAboutUs = "Please select an option";
    if (d.hearAboutUs === "others" && !d.hearAboutUsOther.trim())
      errs.hearAboutUsOther = "Please tell us how you heard about AIM";
    if (!d.agreedToTerms)
      errs.agreedToTerms = "You must agree to the terms to continue";
    return errs;
  }, []);

  const handleChange = <K extends keyof AdditionalInfo>(
    field: K,
    value: AdditionalInfo[K]
  ) => {
    const updated = { ...data, [field]: value };
    onChange(updated);
    const errs = validate(updated);
    setErrors(errs);
    onValidChange(!Object.values(errs).some(Boolean));
  };

  const handleBlur = (field: keyof AdditionalInfo) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const errs = validate(data);
    setErrors(errs);
    onValidChange(!Object.values(errs).some(Boolean));
  };

  const showOthers = data.hearAboutUs === "others";

  return (
    <div className="flex flex-col gap-8">
      <FormSelect
        label="How Did You Hear About Us?"
        placeholder="-- Please Choose --"
        value={data.hearAboutUs}
        onChange={(v) => handleChange("hearAboutUs", v)}
        onBlur={() => handleBlur("hearAboutUs")}
        options={HEAR_ABOUT_US_OPTIONS}
        error={touched.hearAboutUs ? errors.hearAboutUs : undefined}
        required
      />

      <AnimatePresence>
        {showOthers && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: "hidden" }}
          >
            <FormInput
              label="Please Provide Details"
              placeholder="Tell us how you found AIM..."
              value={data.hearAboutUsOther}
              onChange={(v) => handleChange("hearAboutUsOther", v)}
              onBlur={() => handleBlur("hearAboutUsOther")}
              error={touched.hearAboutUsOther ? errors.hearAboutUsOther : undefined}
              hint="Since you answered Others above"
              required
            />
          </motion.div>
        )}
      </AnimatePresence>

      <FormTextarea
        label="Anything Else We Should Know?"
        placeholder="Any special requirements, questions, or context..."
        value={data.anythingElse}
        onChange={(v) => handleChange("anythingElse", v)}
        rows={4}
        hint="Optional — we read every message"
      />

      <div className="border-t border-white/10 pt-4">
        <FormCheckbox
          checked={data.agreedToTerms}
          onChange={(v) => handleChange("agreedToTerms", v)}
          onBlur={() => handleBlur("agreedToTerms")}
          error={touched.agreedToTerms ? errors.agreedToTerms : undefined}
          label={
            <span>
              I (and the organization I represent) agree to the{" "}
              <a
                href="/terms"
                target="_blank"
                className="text-[var(--color-brand)] underline underline-offset-2 hover:opacity-80 transition-opacity"
              >
                Terms of Subscription
              </a>
              ,{" "}
              <a
                href="/terms"
                target="_blank"
                className="text-[var(--color-brand)] underline underline-offset-2 hover:opacity-80 transition-opacity"
              >
                Terms of Use
              </a>{" "}
              and{" "}
              <a
                href="/privacy"
                target="_blank"
                className="text-[var(--color-brand)] underline underline-offset-2 hover:opacity-80 transition-opacity"
              >
                Privacy Policy
              </a>
              . If subscribing on behalf of an organization, I certify I am
              duly authorized to bind the organization.
            </span>
          }
        />
      </div>
    </div>
  );
}
