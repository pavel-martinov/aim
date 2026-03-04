/** Centralized validation utilities for form fields */

export const PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[\d\s\-()]{7,}$/,
  url: /^https?:\/\/.+/,
  lettersOnly: /^[a-zA-Z\s]+$/,
};

export const filterLettersOnly = (value: string) =>
  value.replace(/[^a-zA-Z\s]/g, "");

export const filterNumbersOnly = (value: string) =>
  value.replace(/[^\d\s\-+()]/g, "");

export function validateRequired(
  value: string,
  label: string
): string | undefined {
  if (!value.trim()) return `${label} is required`;
}

export function validateEmail(value: string): string | undefined {
  if (!value.trim()) return "Email is required";
  if (!PATTERNS.email.test(value)) return "Please enter a valid email";
}

export function validatePhone(value: string): string | undefined {
  if (!value.trim()) return "Phone number is required";
  if (!PATTERNS.phone.test(value)) return "Please enter a valid phone number";
}

export function validateUrl(value: string): string | undefined {
  if (!value.trim()) return "URL is required";
  if (!PATTERNS.url.test(value))
    return "Please enter a valid URL (https://...)";
}

export function validateLettersOnly(
  value: string,
  label: string
): string | undefined {
  const req = validateRequired(value, label);
  if (req) return req;
  if (!PATTERNS.lettersOnly.test(value))
    return `${label} can only contain letters`;
}
