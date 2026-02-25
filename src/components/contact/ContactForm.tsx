"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

/** Validation patterns */
const PATTERNS = {
  name: /^[a-zA-Z\s]+$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  subject: /^[a-zA-Z\s]+$/,
};

/** Minimum time (ms) form must be open before submit (bot protection) */
const MIN_FORM_TIME = 3000;
/** Cooldown (ms) after successful submit */
const SUBMIT_COOLDOWN = 30000;

type FormState = "idle" | "submitting" | "success" | "error";

type FieldErrors = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

/**
 * Contact form with validation, bot protection, and animated states.
 */
export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState(""); // Bot trap
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [formState, setFormState] = useState<FormState>("idle");
  const [cooldownEnd, setCooldownEnd] = useState<number | null>(null);

  const formOpenTime = useRef(Date.now());

  // Check if form is in cooldown
  const isInCooldown = cooldownEnd !== null && Date.now() < cooldownEnd;

  /** Validate a single field */
  const validateField = useCallback(
    (field: string, value: string): string | undefined => {
      switch (field) {
        case "name":
          if (!value.trim()) return "Name is required";
          if (!PATTERNS.name.test(value)) return "Name can only contain letters";
          break;
        case "email":
          if (!value.trim()) return "Email is required";
          if (!PATTERNS.email.test(value)) return "Please enter a valid email";
          break;
        case "subject":
          if (!value.trim()) return "Subject is required";
          if (!PATTERNS.subject.test(value))
            return "Subject can only contain letters";
          break;
        case "message":
          if (!value.trim()) return "Message is required";
          if (value.trim().length < 10)
            return "Message must be at least 10 characters";
          break;
      }
      return undefined;
    },
    []
  );

  /** Validate all fields */
  const validateAll = useCallback((): FieldErrors => {
    return {
      name: validateField("name", name),
      email: validateField("email", email),
      subject: validateField("subject", subject),
      message: validateField("message", message),
    };
  }, [name, email, subject, message, validateField]);

  /** Check if form is valid for submission */
  const isFormValid =
    !!name.trim() &&
    !!email.trim() &&
    !!subject.trim() &&
    !!message.trim() &&
    PATTERNS.name.test(name) &&
    PATTERNS.email.test(email) &&
    PATTERNS.subject.test(subject) &&
    message.trim().length >= 10;

  /** Handle field blur - validate and mark as touched */
  const handleBlur = (field: string, value: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  /** Filter input for name/subject fields (letters only) */
  const filterLettersOnly = (value: string) => {
    return value.replace(/[^a-zA-Z\s]/g, "");
  };

  /** Handle form submission */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Bot protection: honeypot check
    if (honeypot) return;

    // Bot protection: time check
    if (Date.now() - formOpenTime.current < MIN_FORM_TIME) return;

    // Cooldown check
    if (isInCooldown) return;

    // Validate all fields
    const allErrors = validateAll();
    setErrors(allErrors);
    setTouched({ name: true, email: true, subject: true, message: true });

    if (Object.values(allErrors).some(Boolean)) return;

    setFormState("submitting");

    try {
      // Simulate API call (replace with actual endpoint in production)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setFormState("success");
      setCooldownEnd(Date.now() + SUBMIT_COOLDOWN);

      // Reset form after success
      setTimeout(() => {
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
        setTouched({});
        setErrors({});
      }, 2000);
    } catch {
      setFormState("error");
    }
  };

  /** Reset form state after cooldown */
  useEffect(() => {
    if (formState === "success" || formState === "error") {
      const timer = setTimeout(() => {
        setFormState("idle");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [formState]);

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-[520px] flex-col justify-between gap-8 bg-black p-8 md:p-12"
      noValidate
    >
      {/* Honeypot field - hidden from users, filled by bots */}
      <input
        type="text"
        name="website"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div className="flex flex-col gap-8">
        {/* Name Input */}
        <FormInput
          label="Name"
          placeholder="YOUR NAME"
          value={name}
          onChange={(v) => setName(filterLettersOnly(v))}
          onBlur={() => handleBlur("name", name)}
          error={touched.name ? errors.name : undefined}
          disabled={formState === "submitting"}
        />

        {/* Email Input */}
        <FormInput
          label="Email"
          placeholder="YOUR EMAIL ADDRESS"
          type="email"
          value={email}
          onChange={setEmail}
          onBlur={() => handleBlur("email", email)}
          error={touched.email ? errors.email : undefined}
          disabled={formState === "submitting"}
        />

        {/* Subject Input */}
        <FormInput
          label="Subject"
          placeholder="WHAT'S THIS ABOUT?"
          value={subject}
          onChange={(v) => setSubject(filterLettersOnly(v))}
          onBlur={() => handleBlur("subject", subject)}
          error={touched.subject ? errors.subject : undefined}
          disabled={formState === "submitting"}
        />

        {/* Message Input */}
        <FormInput
          label="Message"
          placeholder="HOW CAN WE HELP?"
          value={message}
          onChange={setMessage}
          onBlur={() => handleBlur("message", message)}
          error={touched.message ? errors.message : undefined}
          disabled={formState === "submitting"}
          multiline
        />
      </div>

      {/* Submit Button */}
      <SubmitButton
        isValid={isFormValid}
        formState={formState}
        isInCooldown={isInCooldown}
      />
    </form>
  );
}

/**
 * Form input with label, validation states, and animations.
 */
function FormInput({
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  disabled,
  type = "text",
  multiline = false,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
  disabled?: boolean;
  type?: string;
  multiline?: boolean;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value.trim().length > 0;

  const inputClasses = cn(
    "w-full border-b bg-transparent py-3 text-xl uppercase text-white outline-none transition-colors duration-300",
    "placeholder:text-white/50",
    error
      ? "border-red-500"
      : isFocused
        ? "border-white"
        : hasValue
          ? "border-white/70"
          : "border-white/50"
  );

  const labelClasses = cn(
    "text-sm uppercase transition-colors duration-300",
    error ? "text-red-500" : isFocused ? "text-white" : "text-white/50"
  );

  return (
    <div className="flex flex-col gap-1.5 overflow-hidden">
      <label className={labelClasses}>{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            onBlur();
          }}
          placeholder={placeholder}
          disabled={disabled}
          rows={3}
          className={cn(inputClasses, "resize-none")}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            onBlur();
          }}
          placeholder={placeholder}
          disabled={disabled}
          className={inputClasses}
        />
      )}
      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="text-xs text-red-500"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Submit button with disabled, loading, success, and error states.
 */
function SubmitButton({
  isValid,
  formState,
  isInCooldown,
}: {
  isValid: boolean;
  formState: FormState;
  isInCooldown: boolean;
}) {
  const isDisabled = !isValid || formState === "submitting" || isInCooldown;

  const buttonClasses = cn(
    "relative w-full border py-4 text-sm uppercase tracking-widest transition-all duration-500",
    isDisabled
      ? "cursor-not-allowed border-[#0a5200] text-white/50"
      : "btn-fill-hover border-[var(--color-brand)] text-white"
  );

  return (
    <button
      type="submit"
      disabled={isDisabled}
      className={buttonClasses}
      style={{ fontFamily: "var(--font-geist-mono), monospace" }}
    >
      <AnimatePresence mode="wait">
        {formState === "submitting" ? (
          <motion.span
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center gap-2"
          >
            <LoadingSpinner />
            Sending...
          </motion.span>
        ) : formState === "success" ? (
          <motion.span
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-[var(--color-brand)]"
          >
            Message Sent!
          </motion.span>
        ) : formState === "error" ? (
          <motion.span
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-red-500"
          >
            Failed to send. Try again.
          </motion.span>
        ) : (
          <motion.span
            key="submit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            Submit
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

/** Simple loading spinner */
function LoadingSpinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" className="opacity-25" />
      <path
        d="M4 12a8 8 0 018-8"
        className="opacity-75"
        strokeLinecap="round"
      />
    </svg>
  );
}
