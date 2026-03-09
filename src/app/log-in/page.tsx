import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "Log In | AIM",
  description: "Log in to your AIM account",
};

/** Login page with email/password form. */
export default function LoginPage() {
  return (
    <AuthLayout
      headline="Welcome Back"
      subheadline="Log in to access your AIM account"
    >
      <LoginForm />
    </AuthLayout>
  );
}
