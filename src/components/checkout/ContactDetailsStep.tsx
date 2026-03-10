"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import FormInput from "@/components/ui/FormInput";
import FormSelect from "@/components/ui/FormSelect";
import FormTextarea from "@/components/ui/FormTextarea";
import FormCheckbox from "@/components/ui/FormCheckbox";
import { ContactDetails, HEAR_ABOUT_US_OPTIONS } from "./types";
import {
  validateEmail,
  validateLettersOnly,
  validatePhone,
} from "@/lib/validation";

interface ContactDetailsStepProps {
  data: ContactDetails;
  onChange: (data: ContactDetails) => void;
  onValidChange: (valid: boolean) => void;
}

type Errors = Partial<Record<keyof ContactDetails, string>>;
type Touched = Partial<Record<keyof ContactDetails, boolean>>;

/**
 * Combined contact details step for Academy checkout.
 * Collects: name, email, org name, mobile, discovery source, comment, terms.
 */
export default function ContactDetailsStep({
  data,
  onChange,
  onValidChange,
}: ContactDetailsStepProps) {
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Touched>({});

  const validate = useCallback((d: ContactDetails): Errors => {
    const errs: Errors = {
      fullName: validateLettersOnly(d.fullName, "Full name"),
      email: validateEmail(d.email),
      mobileNumber: validatePhone(d.mobileNumber),
    };
    if (!d.hearAboutUs) errs.hearAboutUs = "Please select an option";
    if (d.hearAboutUs === "others" && !d.hearAboutUsOther.trim()) {
      errs.hearAboutUsOther = "Please tell us how you heard about AIM";
    }
    if (!d.agreedToTerms) {
      errs.agreedToTerms = "You must agree to the terms to continue";
    }
    return errs;
  }, []);

  const handleChange = <K extends keyof ContactDetails>(
    field: K,
    value: ContactDetails[K]
  ) => {
    const updated = { ...data, [field]: value };
    onChange(updated);
    const errs = validate(updated);
    setErrors(errs);
    onValidChange(!Object.values(errs).some(Boolean));
  };

  const handleBlur = (field: keyof ContactDetails) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const errs = validate(data);
    setErrors(errs);
    onValidChange(!Object.values(errs).some(Boolean));
  };

  const isFieldValid = (field: keyof ContactDetails) => {
    if (field === "organizationName" || field === "comment") {
      return !!data[field];
    }
    return touched[field] && !errors[field] && !!data[field];
  };

  const showOthers = data.hearAboutUs === "others";

  return (
    <div className="flex flex-col gap-8">
      <FormInput
        label="Full Name"
        placeholder="e.g. Jordan Smith"
        value={data.fullName}
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
        value={data.email}
        onChange={(v) => handleChange("email", v)}
        onBlur={() => handleBlur("email")}
        error={touched.email ? errors.email : undefined}
        isValid={isFieldValid("email")}
        required
        autoComplete="email"
      />

      <FormInput
        label="Organization Name"
        placeholder="e.g. Elite Soccer Academy"
        value={data.organizationName}
        onChange={(v) => handleChange("organizationName", v)}
        onBlur={() => handleBlur("organizationName")}
        isValid={isFieldValid("organizationName")}
        hint="Optional — leave blank if you're an individual coach"
        autoComplete="organization"
      />

      <FormInput
        label="Mobile Number"
        placeholder="e.g. +1 555 000 1234"
        type="tel"
        value={data.mobileNumber}
        onChange={(v) => handleChange("mobileNumber", v)}
        onBlur={() => handleBlur("mobileNumber")}
        error={touched.mobileNumber ? errors.mobileNumber : undefined}
        isValid={isFieldValid("mobileNumber")}
        required
        autoComplete="tel"
      />

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
        value={data.comment}
        onChange={(v) => handleChange("comment", v)}
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
    </div>
  );
}
