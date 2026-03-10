/**
 * Mock authentication handlers for development/testing.
 * Replace with real Supabase Auth when ready.
 */

export type AuthResult = {
  success: boolean;
  error?: string;
};

const SESSION_KEY = "aim-session";
const SESSION_DURATION_MS = 60 * 60 * 1000; // 1 hour

/** Simulates network delay */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Saves session timestamp to localStorage. */
export function saveSession(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_KEY, Date.now().toString());
}

/** Returns true if a valid (non-expired) session exists. */
export function getSession(): boolean {
  if (typeof window === "undefined") return false;
  const timestamp = localStorage.getItem(SESSION_KEY);
  if (!timestamp) return false;
  const elapsed = Date.now() - parseInt(timestamp, 10);
  return elapsed < SESSION_DURATION_MS;
}

/** Clears the session from localStorage. */
export function clearSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}

/** Shared mock credentials for profile testing. */
export const MOCK_TEST_CREDENTIALS = {
  login: "test",
  password: "123",
} as const;

/**
 * Mock login for local testing.
 * Accepts either:
 * - login: "test", password: "123"
 * - any valid email, password: "demo123" (legacy)
 */
export async function mockLogin(email: string, password: string): Promise<AuthResult> {
  await delay(800);

  if (!email || !password) {
    return { success: false, error: "Email and password are required" };
  }

  if (email === MOCK_TEST_CREDENTIALS.login && password === MOCK_TEST_CREDENTIALS.password) {
    saveSession();
    return { success: true };
  }

  if (password === "demo123") {
    saveSession();
    return { success: true };
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
