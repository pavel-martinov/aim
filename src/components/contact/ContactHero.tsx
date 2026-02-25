"use client";

import ContactForm from "./ContactForm";

/**
 * Contact hero section with headline on left, form on right.
 * Full-height section with 50/50 split on desktop.
 */
export default function ContactHero() {
  return (
    <section className="relative flex min-h-screen w-full flex-col lg:flex-row">
      {/* Left side - Headline and contact details */}
      <div className="flex w-full flex-col justify-center px-6 py-24 pt-32 lg:w-1/2 lg:px-12 lg:py-0">
        <div className="mx-auto flex w-full max-w-[600px] flex-col gap-6 lg:mx-0">
          {/* Headline */}
          <h1
            className="flex flex-wrap text-5xl uppercase leading-[1.1] md:text-6xl lg:text-7xl"
            style={{ fontFamily: "var(--font-anton), sans-serif" }}
          >
            <span className="text-[var(--color-brand)]">REACH OUT</span>
            <span className="text-white">&nbsp;TO US TO LEARN MORE ABOUT AIM</span>
          </h1>

          {/* Decorative divider */}
          <div className="my-2 h-px w-full bg-gradient-to-r from-[var(--color-brand)] via-white/20 to-transparent" />

          {/* Contact details */}
          <div className="flex flex-col gap-4">
            <ContactDetail label="ADDRESS">
              <p>101 College Street,</p>
              <p>Dripping Springs, TX 78620</p>
            </ContactDetail>
            <ContactDetail label="EMAIL">
              <a
                href="mailto:support@aim.io"
                className="transition-colors hover:text-[var(--color-brand)]"
              >
                support@aim.io
              </a>
            </ContactDetail>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex w-full items-center justify-center bg-white/10 px-6 py-16 lg:w-1/2 lg:py-0">
        <ContactForm />
      </div>
    </section>
  );
}

/**
 * Reusable contact detail row with label and content.
 */
function ContactDetail({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex flex-col gap-2 py-3 text-sm uppercase tracking-wide text-white sm:flex-row sm:items-start sm:justify-between"
      style={{ fontFamily: "var(--font-geist-mono), monospace" }}
    >
      <span className="w-full shrink-0 text-white/70 sm:w-1/3">{label}</span>
      <div className="w-full sm:w-2/3">{children}</div>
    </div>
  );
}
