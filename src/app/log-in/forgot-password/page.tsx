import { redirect } from "next/navigation";
import AuthLayout from "@/components/auth/AuthLayout";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export const metadata = {
  title: "Forgot Password | AIM",
  description: "Reset your AIM account password",
};

/** V1 hides forgot-password and returns users to the login chooser. */
export default function ForgotPasswordPage() {
  redirect("/log-in");
}

/** Legacy forgot-password page preserved for post-V1 reuse. */
function LegacyForgotPasswordPage() {
  return (
    <AuthLayout
      headline="Forgot Password?"
      subheadline="No worries, we'll send you reset instructions"
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
