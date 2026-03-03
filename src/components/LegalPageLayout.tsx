"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

type LegalPageLayoutProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

/**
 * Shared layout for legal pages (Privacy Policy, Terms & Conditions).
 * Dark theme with proper typography and spacing.
 */
export default function LegalPageLayout({
  title,
  subtitle,
  children,
}: LegalPageLayoutProps) {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <Header visible />
      
      {/* Hero section with title */}
      <section className="bg-black pb-16 pt-32">
        <div className="mx-auto max-w-4xl px-6">
          <RevealOnScroll dramatic>
            <h1
              className="text-4xl uppercase leading-tight text-white sm:text-5xl md:text-6xl"
              style={{ fontFamily: "var(--font-anton), sans-serif" }}
            >
              {title.split(" ").map((word, i) => (
                <span key={i} className={i === 0 ? "text-[var(--color-brand)]" : ""}>
                  {word}{" "}
                </span>
              ))}
            </h1>
          </RevealOnScroll>
          {subtitle && (
            <RevealOnScroll delay={0.1}>
              <p
                className="mt-4 text-lg text-white/60"
                style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
              >
                {subtitle}
              </p>
            </RevealOnScroll>
          )}
        </div>
      </section>

      {/* Content section */}
      <section className="bg-[#0a0a0a] py-16">
        <div className="mx-auto max-w-4xl px-6">
          <RevealOnScroll delay={0.2}>
            <div
              className="prose prose-invert max-w-none prose-headings:font-normal prose-headings:uppercase prose-headings:tracking-wide prose-h2:mt-12 prose-h2:text-2xl prose-h2:text-white prose-h3:mt-8 prose-h3:text-xl prose-h3:text-white/90 prose-p:text-white/70 prose-p:leading-relaxed prose-strong:text-white prose-ul:text-white/70 prose-li:marker:text-[var(--color-brand)]"
              style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
            >
              {children}
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <Footer />
    </main>
  );
}
