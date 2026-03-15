/**
 * Mock authentication handlers for development/testing.
 * Replace with real Supabase Auth when ready.
 */

export type UserRole = "superadmin" | "admin" | "academy_owner" | "coach" | "parent" | "player";

export type AuthResult = {
  success: boolean;
  error?: string;
  role?: UserRole;
  redirectUrl?: string;
};

export interface SessionData {
  timestamp: number;
  email: string;
  role: UserRole;
  redirectUrl: string;
}

const SESSION_KEY = "aim-session";

const EXTERNAL_URLS = {
  adminUI: "https://dev1-admin-ui.aim-football.com/content-moderation",
  coachPortal: "https://aim-coach-portal-dev-gmgjjvjmpq-uc.a.run.app/login",
} as const;

/** Demo credentials for stakeholder presentation. */
const DEMO_CREDENTIALS: Record<string, { password: string; role: UserRole; redirectUrl: string }> = {
  "parent@aim.io": { password: "pass123", role: "parent", redirectUrl: "/profile" },
  "player@aim.io": { password: "pass123", role: "player", redirectUrl: "/profile" },
  "superadmin@aim.com": { password: "aim@123", role: "superadmin", redirectUrl: EXTERNAL_URLS.adminUI },
  "admin@aim.com": { password: "aim@123", role: "admin", redirectUrl: EXTERNAL_URLS.adminUI },
  "john@aim.com": { password: "Aim@2025", role: "coach", redirectUrl: EXTERNAL_URLS.coachPortal },
  "academy@aim.com": { password: "Aim@2025", role: "academy_owner", redirectUrl: EXTERNAL_URLS.coachPortal },
};

/** Simulates network delay */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Session persistence is temporarily disabled for stakeholder testing.
 * Keep these helpers in place so the original localStorage logic can be restored quickly.
 */
export function saveSession(_email: string, _role: UserRole, _redirectUrl: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}

/** Returns null while saved-session logic is temporarily disabled. */
export function getSession(): SessionData | null {
  if (typeof window !== "undefined") {
    localStorage.removeItem(SESSION_KEY);
  }
  return null;
}

/** Clears the session from localStorage. */
export function clearSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}

/** Returns human-readable role label for UI display. */
export function getRoleLabel(role: UserRole): string {
  const labels: Record<UserRole, string> = {
    superadmin: "Super Admin",
    admin: "Admin",
    academy_owner: "Academy Owner",
    coach: "Coach",
    parent: "Parent",
    player: "Player",
  };
  return labels[role];
}

/** Checks if redirect URL is external. */
export function isExternalUrl(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://");
}

/** Shared mock credentials for profile testing (legacy). */
export const MOCK_TEST_CREDENTIALS = {
  login: "test",
  password: "123",
} as const;

/**
 * Mock login with role-based authentication.
 * Checks demo credentials first, then falls back to legacy test accounts.
 */
export async function mockLogin(email: string, password: string): Promise<AuthResult> {
  await delay(800);

  if (!email || !password) {
    return { success: false, error: "Email and password are required" };
  }

  const emailLower = email.toLowerCase();
  const demoAccount = DEMO_CREDENTIALS[emailLower];
  
  if (demoAccount && demoAccount.password === password) {
    return { 
      success: true, 
      role: demoAccount.role, 
      redirectUrl: demoAccount.redirectUrl 
    };
  }

  if (email === MOCK_TEST_CREDENTIALS.login && password === MOCK_TEST_CREDENTIALS.password) {
    return { success: true, role: "player", redirectUrl: "/profile" };
  }

  if (password === "demo123") {
    return { success: true, role: "player", redirectUrl: "/profile" };
  }

  return { success: false, error: "Invalid email or password" };
}

/**
 * Mock send reset email - always succeeds for valid email format
 */
export async function mockSendResetEmail(email: string): Promise<AuthResult> {
  await delay(1000);

  if (!email) {
    return { success: false, error: "Email is required" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, error: "Please enter a valid email address" };
  }

  return { success: true };
}

/**
 * Mock reset password - validates token format and password requirements
 */
export async function mockResetPassword(
  token: string,
  password: string,
  confirmPassword: string
): Promise<AuthResult> {
  await delay(800);

  if (!token || token.length < 10) {
    return { success: false, error: "Invalid or expired reset link" };
  }

  if (!password) {
    return { success: false, error: "Password is required" };
  }

  if (password.length < 8) {
    return { success: false, error: "Password must be at least 8 characters" };
  }

  if (password !== confirmPassword) {
    return { success: false, error: "Passwords do not match" };
  }

  return { success: true };
}
