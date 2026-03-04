"use client";

import { useState, useCallback } from "react";
import FormInput from "@/components/ui/FormInput";
import { PayerDetails } from "./types";
import {
  validateEmail,
  validateLettersOnly,
} from "@/lib/validation";

interface PayerDetailsStepProps {
  data: PayerDetails;
  onChange: (data: PayerDetails) => void;
  onValidChange: (valid: boolean) => void;
}

type Errors = Partial<Record<keyof PayerDetails, string>>;
type Touched = Partial<Record<keyof PayerDetails, boolean>>;

/**
 * Step 1 - Payer Details: name and billing email.
 */
export default function PayerDetailsStep({
  data,
  onChange,
  onValidChange,
}: PayerDetailsStepProps) {
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Touched>({});

  const validate = useCallback(
    (d: PayerDetails): Errors => ({
      fullName: validateLettersOnly(d.fullName, "Full name"),
      email: validateEmail(d.email),
    }),
    []
  );

  const handleChange = (field: keyof PayerDetails, value: string) => {
    const updated = { ...data, [field]: value };
    onChange(updated);
    const errs = validate(updated);
    setErrors(errs);
    onValidChange(!Object.values(errs).some(Boolean));
  };

  const handleBlur = (field: keyof PayerDetails) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const errs = validate(data);
    setErrors(errs);
    onValidChange(!Object.values(errs).some(Boolean));
  };

  const isFieldValid = (field: keyof PayerDetails) =>
    touched[field] && !errors[field] && !!data[field];

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
        hint="Your billing receipt will be sent here"
      />
    </div>
  );
}
