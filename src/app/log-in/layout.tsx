type LoginLayoutProps = {
  children: React.ReactNode;
};

/** Separates auth routes from the marketing-site experience. */
export default function LoginLayout({ children }: LoginLayoutProps) {
  return <div className="min-h-screen bg-[#0a0a0a] text-white">{children}</div>;
}
