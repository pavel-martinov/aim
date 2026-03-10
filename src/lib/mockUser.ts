/**
 * Mock user data and handlers for profile development.
 * Replace with real API calls / Supabase when ready.
 */

import type {
  User,
  Invoice,
  PaymentMethod,
  UpdateUserPayload,
  UpdatePasswordPayload,
  SubscriptionTier,
  LoginActivity,
  ActiveSession,
} from "@/types/user";

/** Simulates network delay */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Plan pricing information */
export const PLAN_PRICING: Record<SubscriptionTier, { name: string; price: number; features: string[] }> = {
  free: {
    name: "Free",
    price: 0,
    features: ["Basic profile", "Limited challenges", "Community access"],
  },
  pro: {
    name: "Pro",
    price: 9.99,
    features: ["Unlimited challenges", "Video analysis", "Performance tracking", "Priority support"],
  },
  premium: {
    name: "Premium",
    price: 19.99,
    features: ["Everything in Pro", "1-on-1 coaching sessions", "Custom training plans", "Early access to features"],
  },
};

/** Pre-made avatar options for Netflix-style picker */
export const PRESET_AVATARS = [
  "https://api.dicebear.com/9.x/personas/png?seed=Alex&size=256",
  "https://api.dicebear.com/9.x/personas/png?seed=Jordan&size=256",
  "https://api.dicebear.com/9.x/personas/png?seed=Taylor&size=256",
  "https://api.dicebear.com/9.x/personas/png?seed=Riley&size=256",
  "https://api.dicebear.com/9.x/personas/png?seed=Sam&size=256",
  "https://api.dicebear.com/9.x/personas/png?seed=Cameron&size=256",
  "https://api.dicebear.com/9.x/personas/png?seed=Casey&size=256",
  "https://api.dicebear.com/9.x/personas/png?seed=Hayden&size=256",
  "https://api.dicebear.com/9.x/personas/png?seed=Morgan&size=256",
  "https://api.dicebear.com/9.x/personas/png?seed=Quinn&size=256",
  "https://api.dicebear.com/9.x/personas/png?seed=Blake&size=256",
  "https://api.dicebear.com/9.x/personas/png?seed=Parker&size=256",
];

/** Division display config */
export const DIVISION_CONFIG = {
  bronze: { label: "Bronze", color: "#CD7F32" },
  silver: { label: "Silver", color: "#C0C0C0" },
  gold: { label: "Gold", color: "#FFD700" },
  platinum: { label: "Platinum", color: "#E5E4E2" },
  diamond: { label: "Diamond", color: "#B9F2FF" },
} as const;

/** Mock user data */
const mockUser: User = {
  id: "usr_mock_123",
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  phone: "+1 555 123 4567",
  avatarUrl: undefined,
  dateOfBirth: "1998-05-15",
  country: "United States",
  gender: "male",
  preferredPosition: "Central Midfielder",
  createdAt: "2024-06-15T10:30:00Z",
  subscription: {
    id: "sub_mock_456",
    tier: "pro",
    status: "active",
    currentPeriodStart: "2026-02-10T00:00:00Z",
    currentPeriodEnd: "2026-03-10T00:00:00Z",
    cancelAtPeriodEnd: false,
    pricePerMonth: 9.99,
  },
  level: 3,
  division: "gold",
  academy: {
    id: "acad_001",
    name: "Elite Football Academy",
    logoUrl: "/academies/template-logo.svg",
  },
};

/** Mock login activity */
const mockLoginActivity: LoginActivity[] = [
  {
    id: "login_001",
    device: "iPhone 15 Pro",
    browser: "Safari Mobile",
    location: "New York, US",
    ipAddress: "192.168.1.xxx",
    timestamp: "2026-03-10T08:30:00Z",
    isCurrent: true,
  },
  {
    id: "login_002",
    device: "MacBook Pro",
    browser: "Chrome 122",
    location: "New York, US",
    ipAddress: "192.168.1.xxx",
    timestamp: "2026-03-09T14:22:00Z",
    isCurrent: false,
  },
  {
    id: "login_003",
    device: "Windows PC",
    browser: "Firefox 123",
    location: "Boston, US",
    ipAddress: "10.0.0.xxx",
    timestamp: "2026-03-07T09:15:00Z",
    isCurrent: false,
  },
  {
    id: "login_004",
    device: "iPad Pro",
    browser: "Safari",
    location: "New York, US",
    ipAddress: "192.168.1.xxx",
    timestamp: "2026-03-05T18:45:00Z",
    isCurrent: false,
  },
];

/** Mock active sessions */
let mockActiveSessions: ActiveSession[] = [
  {
    id: "session_001",
    device: "iPhone 15 Pro",
    browser: "Safari Mobile",
    location: "New York, US",
    lastActive: "2026-03-10T08:30:00Z",
    isCurrent: true,
  },
  {
    id: "session_002",
    device: "MacBook Pro",
    browser: "Chrome 122",
    location: "New York, US",
    lastActive: "2026-03-09T14:22:00Z",
    isCurrent: false,
  },
];

/** Mock invoices */
const mockInvoices: Invoice[] = [
  {
    id: "inv_001",
    date: "2026-02-10",
    amount: 9.99,
    currency: "USD",
    status: "paid",
    description: "Pro Plan - Monthly",
    downloadUrl: "#",
  },
  {
    id: "inv_002",
    date: "2026-01-10",
    amount: 9.99,
    currency: "USD",
    status: "paid",
    description: "Pro Plan - Monthly",
    downloadUrl: "#",
  },
  {
    id: "inv_003",
    date: "2025-12-10",
    amount: 9.99,
    currency: "USD",
    status: "paid",
    description: "Pro Plan - Monthly",
    downloadUrl: "#",
  },
];

/** Mock payment method */
const mockPaymentMethod: PaymentMethod = {
  id: "pm_mock_789",
  brand: "visa",
  last4: "4242",
  expiryMonth: 12,
  expiryYear: 2028,
  isDefault: true,
};

type MockResult<T> = { success: true; data: T } | { success: false; error: string };

/** Returns mock user data */
export async function getMockUser(): Promise<MockResult<User>> {
  await delay(500);
  return { success: true, data: { ...mockUser } };
}

/** Updates mock user data */
export async function updateMockUser(updates: UpdateUserPayload): Promise<MockResult<User>> {
  await delay(600);
  Object.assign(mockUser, updates);
  return { success: true, data: { ...mockUser } };
}

/** Updates user avatar URL */
export async function updateMockAvatar(avatarUrl: string): Promise<MockResult<User>> {
  await delay(800);
  mockUser.avatarUrl = avatarUrl;
  return { success: true, data: { ...mockUser } };
}

/** Updates user password */
export async function updateMockPassword(payload: UpdatePasswordPayload): Promise<MockResult<null>> {
  await delay(700);

  if (payload.currentPassword !== "demo123") {
    return { success: false, error: "Current password is incorrect" };
  }

  if (payload.newPassword.length < 8) {
    return { success: false, error: "Password must be at least 8 characters" };
  }

  if (payload.newPassword !== payload.confirmPassword) {
    return { success: false, error: "Passwords do not match" };
  }

  return { success: true, data: null };
}

/** Returns mock invoices */
export async function getMockInvoices(): Promise<MockResult<Invoice[]>> {
  await delay(400);
  return { success: true, data: [...mockInvoices] };
}

/** Returns mock payment method */
export async function getMockPaymentMethod(): Promise<MockResult<PaymentMethod | null>> {
  await delay(300);
  return { success: true, data: { ...mockPaymentMethod } };
}

/** Updates subscription tier */
export async function updateMockSubscription(tier: SubscriptionTier): Promise<MockResult<User>> {
  await delay(1000);
  
  mockUser.subscription = {
    ...mockUser.subscription,
    tier,
    pricePerMonth: PLAN_PRICING[tier].price,
    status: tier === "free" ? "cancelled" : "active",
    cancelAtPeriodEnd: tier === "free",
  };

  return { success: true, data: { ...mockUser } };
}

/** Cancels subscription (sets to cancel at period end) */
export async function cancelMockSubscription(): Promise<MockResult<User>> {
  await delay(800);
  
  mockUser.subscription.cancelAtPeriodEnd = true;
  return { success: true, data: { ...mockUser } };
}

/** Reactivates a cancelled subscription */
export async function reactivateMockSubscription(): Promise<MockResult<User>> {
  await delay(600);
  
  mockUser.subscription.cancelAtPeriodEnd = false;
  return { success: true, data: { ...mockUser } };
}

/** Football positions for the select dropdown */
export const FOOTBALL_POSITIONS = [
  "Goalkeeper",
  "Right Back",
  "Left Back",
  "Center Back",
  "Defensive Midfielder",
  "Central Midfielder",
  "Attacking Midfielder",
  "Right Midfielder/Winger",
  "Left Midfielder/Winger",
  "Second Striker/Attacking Midfielder",
  "Striker",
];

/** Countries list for the select dropdown */
export const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Spain",
  "Italy",
  "Netherlands",
  "Brazil",
  "Argentina",
  "Mexico",
  "Japan",
  "South Korea",
  "Other",
];

/** Returns mock login activity */
export async function getMockLoginActivity(): Promise<MockResult<LoginActivity[]>> {
  await delay(400);
  return { success: true, data: [...mockLoginActivity] };
}

/** Returns mock active sessions */
export async function getMockActiveSessions(): Promise<MockResult<ActiveSession[]>> {
  await delay(300);
  return { success: true, data: [...mockActiveSessions] };
}

/** Ends a specific session */
export async function endMockSession(sessionId: string): Promise<MockResult<ActiveSession[]>> {
  await delay(500);
  mockActiveSessions = mockActiveSessions.filter((s) => s.id !== sessionId);
  return { success: true, data: [...mockActiveSessions] };
}

/** Ends all sessions except current */
export async function endAllMockSessions(): Promise<MockResult<ActiveSession[]>> {
  await delay(800);
  mockActiveSessions = mockActiveSessions.filter((s) => s.isCurrent);
  return { success: true, data: [...mockActiveSessions] };
}
