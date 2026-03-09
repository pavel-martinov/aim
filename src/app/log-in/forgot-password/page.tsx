import AuthLayout from "@/components/auth/AuthLayout";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export const metadata = {
  title: "Forgot Password | AIM",
  description: "Reset your AIM account password",
};

/** Forgot password page - enter email to receive reset link. */
export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      headline="Forgot Password?"
      subheadline="No worries, we'll send you reset instructions"
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
