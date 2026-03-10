"use client";

import AuthLayout from "@/components/auth/AuthLayout";
import OpaqueButton from "@/components/ui/OpaqueButton";

/** Password reset confirmation page within the shared auth experience. */
export default function PasswordResetSuccessPage() {
  return (
    <AuthLayout
      headline={
        <>
          Password Reset
          <br />
          <span className="text-[var(--color-brand)]">Successful</span>
        </>
      }
      subheadline="Your password has been successfully updated. You can now log in with your new password."
      videoSrc="/images/vision/Vision-1.mp4"
    >
      <div className="flex flex-col gap-8">
        <div className="flex size-20 items-center justify-center rounded-full bg-[var(--color-brand)]/20">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            className="text-[var(--color-brand)]"
          >
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
            <path
              d="M9 12l2 2 4-4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div>
          <OpaqueButton href="/log-in" variant="brand">
            Back to Login
          </OpaqueButton>
        </div>
      </div>
    </AuthLayout>
  );
}
