/**
 * Mock authentication handlers for development/testing.
 * Replace with real Supabase Auth when ready.
 */

export type AuthResult = {
  success: boolean;
  error?: string;
};

/** Simulates network delay */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Mock login - accepts any valid email format with password "demo123"
 */
export async function mockLogin(email: string, password: string): Promise<AuthResult> {
  await delay(800);

  if (!email || !password) {
    return { success: false, error: "Email and password are required" };
  }

  if (password === "demo123") {
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
