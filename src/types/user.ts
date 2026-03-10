/**
 * User-related types for the B2C profile system.
 * Designed to be Stripe-ready for future billing integration.
 */

export type SubscriptionTier = "free" | "pro" | "premium";
export type SubscriptionStatus = "active" | "cancelled" | "past_due" | "trialing";
export type Gender = "male" | "female" | "other";
export type InvoiceStatus = "paid" | "pending" | "failed";
export type PlayerLevel = 1 | 2 | 3 | 4 | 5;
export type Division = "bronze" | "silver" | "gold" | "platinum" | "diamond";

export interface Academy {
  id: string;
  name: string;
  logoUrl: string;
}

export interface LoginActivity {
  id: string;
  device: string;
  browser: string;
  location: string;
  ipAddress: string;
  timestamp: string;
  isCurrent: boolean;
}

export interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface Subscription {
  id: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  pricePerMonth: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  dateOfBirth?: string;
  country?: string;
  gender?: Gender;
  preferredPosition?: string;
  createdAt: string;
  subscription: Subscription;
  level: PlayerLevel;
  division: Division;
  academy?: Academy;
}

export interface Invoice {
  id: string;
  date: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  description: string;
  downloadUrl: string;
}

export interface PaymentMethod {
  id: string;
  brand: "visa" | "mastercard" | "amex" | "discover" | "unknown";
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
}

export interface UpdateUserPayload {
  name?: string;
  phone?: string;
  dateOfBirth?: string;
  country?: string;
  gender?: Gender;
  preferredPosition?: string;
}

export interface UpdatePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export type ProfileSection = "overview" | "account" | "security" | "billing";
