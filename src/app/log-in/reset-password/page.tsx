import AuthLayout from "@/components/auth/AuthLayout";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export const metadata = {
  title: "Reset Password | AIM",
  description: "Create a new password for your AIM account",
};

type ResetPasswordPageProps = {
  searchParams: Promise<{ token?: string }>;
};

/** Reset password page - create new password using token from email link. */
export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const params = await searchParams;
  const token = params.token || null;

  return (
    <AuthLayout
      headline="Create New Password"
      subheadline="Enter your new password below"
    >
      <ResetPasswordForm token={token} />
    </AuthLayout>
  );
}
