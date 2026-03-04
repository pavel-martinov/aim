"use client";

import { useState, useCallback } from "react";
import FormInput from "@/components/ui/FormInput";
import { TeamDetails } from "./types";
import { validateEmail, validateRequired } from "@/lib/validation";

interface TeamDetailsStepProps {
  data: TeamDetails;
  onChange: (data: TeamDetails) => void;
  onValidChange: (valid: boolean) => void;
}

type Errors = Partial<Record<keyof TeamDetails, string>>;
type Touched = Partial<Record<keyof TeamDetails, boolean>>;

/**
 * Step 3 - AIM Team Details: team name and account email.
 */
export default function TeamDetailsStep({
  data,
  onChange,
  onValidChange,
}: TeamDetailsStepProps) {
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Touched>({});

  const validate = useCallback((d: TeamDetails): Errors => {
    return {
      teamName: validateRequired(d.teamName, "Team name"),
      accountEmail: validateEmail(d.accountEmail),
    };
  }, []);

  const handleChange = (field: keyof TeamDetails, value: string) => {
    const updated = { ...data, [field]: value };
    onChange(updated);
    const errs = validate(updated);
    setErrors(errs);
    onValidChange(!Object.values(errs).some(Boolean));
  };

  const handleBlur = (field: keyof TeamDetails) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const errs = validate(data);
    setErrors(errs);
    onValidChange(!Object.values(errs).some(Boolean));
  };

  const isFieldValid = (field: keyof TeamDetails) =>
    touched[field] && !errors[field] && !!data[field];

  return (
    <div className="flex flex-col gap-8">
      <FormInput
        label="AIM Team Name"
        placeholder="e.g. Eagles U16"
        value={data.teamName}
        onChange={(v) => handleChange("teamName", v)}
        onBlur={() => handleBlur("teamName")}
        error={touched.teamName ? errors.teamName : undefined}
        isValid={isFieldValid("teamName")}
        required
        hint="Name of the team you have created in AIM"
      />

      <FormInput
        label="AIM Account Email"
        placeholder="e.g. coach@academy.com"
        type="email"
        value={data.accountEmail}
        onChange={(v) => handleChange("accountEmail", v)}
        onBlur={() => handleBlur("accountEmail")}
        error={touched.accountEmail ? errors.accountEmail : undefined}
        isValid={isFieldValid("accountEmail")}
        required
        autoComplete="email"
        hint="Sign-in email address for your AIM account"
      />
    </div>
  );
}
