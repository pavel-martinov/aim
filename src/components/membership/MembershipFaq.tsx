"use client";

import { useState } from "react";
import FaqItem from "@/components/contact/FaqItem";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

/** Membership-specific FAQ data */
const MEMBERSHIP_FAQ = [
  {
    question: "What's included in the 14-day free trial?",
    answer:
      "You get full access to all features of the plan you're trying—First Touch or Dugout. No limitations, no credit card required to start. At the end of the trial, add payment to continue or your account simply reverts to our free Kickoff plan.",
  },
  {
    question: "Can I switch plans anytime?",
    answer:
      "Absolutely. You can upgrade, downgrade, or cancel your subscription at any time. If you upgrade mid-cycle, you'll be prorated. If you downgrade, the change takes effect at your next billing date. No lock-in contracts, ever.",
  },
  {
    question: "How does the Dugout per-seat pricing work?",
    answer:
      "Dugout includes up to 10 players in the base price. For larger teams: 11-25 players add $2.99/seat monthly ($2.49 annual), 26-50 players add $2.49/seat ($1.99 annual), and 51-100 players add $1.99/seat ($1.49 annual). Teams over 100 players get custom enterprise pricing.",
  },
  {
    question: "What happens when my trial ends?",
    answer:
      "If you've added a payment method, your subscription continues automatically with no interruption. If you haven't added payment, your account reverts to the free Kickoff plan—you keep your data and progress, just with limited features.",
  },
  {
    question: "Is there a discount for teams or academies?",
    answer:
      "Yes! The Dugout plan is specifically designed for coaches and academies with built-in volume discounts. The more players you add, the lower your per-seat cost. For academies with 100+ players, contact us for custom enterprise pricing.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "We want you to be happy with AIM. If you're not satisfied within the first 30 days of a paid subscription, contact support for a full refund. Annual subscribers can also receive prorated refunds for unused months.",
  },
];

/** Stagger delay between FAQ items */
const STAGGER_DELAY = 0.08;

/**
 * Membership FAQ section with expandable accordion items.
 * Uses the same FaqItem component as the contact page for consistency.
 */
export default function MembershipFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-black py-16 lg:py-24">
      {/* Header */}
      <div className="mx-auto mb-12 max-w-3xl px-4 text-center lg:px-6">
        <RevealOnScroll>
          <span
            className="mb-4 inline-block text-xs uppercase tracking-widest text-[var(--color-brand)]"
            style={{ fontFamily: "var(--font-geist-mono), monospace" }}
          >
            Questions
          </span>
        </RevealOnScroll>

        <RevealOnScroll delay={0.1} dramatic>
          <h2
            className="mb-4 text-3xl font-medium text-white md:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
          >
            Frequently Asked
          </h2>
        </RevealOnScroll>

        <RevealOnScroll delay={0.2}>
          <p
            className="text-sm uppercase text-white/60 md:text-base"
            style={{ fontFamily: "var(--font-geist-mono), monospace" }}
          >
            Everything you need to know about our membership plans.
          </p>
        </RevealOnScroll>
      </div>

      {/* FAQ Items */}
      <div className="w-full">
        {MEMBERSHIP_FAQ.map((item, index) => (
          <RevealOnScroll key={index} delay={index * STAGGER_DELAY}>
            <FaqItem
              question={item.question}
              answer={item.answer}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
            />
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}
