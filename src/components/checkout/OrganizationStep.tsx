"use client";

import { useState, useCallback } from "react";
import FormInput from "@/components/ui/FormInput";
import { OrganizationDetails } from "./types";
import { validateEmail, validatePhone } from "@/lib/validation";

interface OrganizationStepProps {
  data: OrganizationDetails;
  onChange: (data: OrganizationDetails) => void;
  onValidChange: (valid: boolean) => void;
}

type Errors = Partial<Record<keyof OrganizationDetails, string>>;
type Touched = Partial<Record<keyof OrganizationDetails, boolean>>;

/**
 * Step 2 - Organization Details: name, primary contact person, email, phone.
 */
export default function OrganizationStep({
  data,
  onChange,
  onValidChange,
}: OrganizationStepProps) {
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Touched>({});

  const validate = useCallback((d: OrganizationDetails): Errors => {
    return {
      // organizationName is optional
      contactEmail: validateEmail(d.contactEmail),
      contactPhone: validatePhone(d.contactPhone),
    };
  }, []);

  const handleChange = (field: keyof OrganizationDetails, value: string) => {
    const updated = { ...data, [field]: value };
    onChange(updated);
    const errs = validate(updated);
    setErrors(errs);
    onValidChange(!Object.values(errs).some(Boolean));
  };

  const handleBlur = (field: keyof OrganizationDetails) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const errs = validate(data);
    setErrors(errs);
    onValidChange(!Object.values(errs).some(Boolean));
  };

  const isFieldValid = (field: keyof OrganizationDetails) =>
    field === "organizationName"
      ? !!data[field]
      : touched[field] && !errors[field] && !!data[field];

  return (
    <div className="flex flex-col gap-8">
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
        label="Contact Email"
        placeholder="e.g. alex@academy.com"
        type="email"
        value={data.contactEmail}
        onChange={(v) => handleChange("contactEmail", v)}
        onBlur={() => handleBlur("contactEmail")}
        error={touched.contactEmail ? errors.contactEmail : undefined}
        isValid={isFieldValid("contactEmail")}
        required
        autoComplete="email"
      />

      <FormInput
        label="Contact Phone Number"
        placeholder="e.g. +1 555 000 1234"
        type="tel"
        value={data.contactPhone}
        onChange={(v) => handleChange("contactPhone", v)}
        onBlur={() => handleBlur("contactPhone")}
        error={touched.contactPhone ? errors.contactPhone : undefined}
        isValid={isFieldValid("contactPhone")}
        required
        autoComplete="tel"
      />
    </div>
  );
}
