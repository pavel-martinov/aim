"use client";

import { useState } from "react";
import FaqItem from "./FaqItem";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

/** FAQ data - questions and answers */
const FAQ_DATA = [
  {
    question: "How does AIM analyse my performance?",
    answer:
      "AIM uses advanced AI-powered video analysis to break down your gameplay frame by frame. Our system identifies patterns, tracks your movements, and compares your performance against professional benchmarks to provide actionable insights for improvement.",
  },
  {
    question: "Do I need any special equipment to use AIM?",
    answer:
      "No special equipment is required. AIM works with any standard gaming setup. Simply record your gameplay using our mobile app or upload existing footage. We support all major gaming platforms and can analyse content from streams or local recordings.",
  },
  {
    question: "What are Report Cards and how do they work?",
    answer:
      "Report Cards are comprehensive performance summaries generated after each analysis session. They include metrics like accuracy, reaction time, positioning efficiency, and decision-making scores. Each Report Card also provides personalised training recommendations based on your specific areas for improvement.",
  },
  {
    question: "Can I track my progress over time?",
    answer:
      "Yes! AIM maintains a complete history of all your analyses and Report Cards. Our dashboard shows your improvement trends across all metrics, allowing you to see exactly how your skills are developing and which training methods are most effective for you.",
  },
  {
    question: "Is AIM suitable for beginners?",
    answer:
      "Absolutely. AIM is designed for players of all skill levels. Our AI adapts its analysis and recommendations based on your current abilities, providing appropriate challenges and achievable goals whether you're just starting out or competing at a professional level.",
  },
  {
    question: "How often should I use AIM to see improvement?",
    answer:
      "We recommend analysing at least 2-3 sessions per week for optimal progress tracking. Consistent use allows our AI to better understand your playing patterns and provide more accurate, personalised recommendations. Most users report noticeable improvements within 2-4 weeks of regular use.",
  },
];

/** Stagger delay between FAQ items */
const STAGGER_DELAY = 0.08;

/**
 * FAQ section with expandable accordion items.
 */
export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-black py-24">
      {/* Header aligned to the same left column rhythm as ContactHero */}
      <div className="w-full px-6 lg:px-12">
        <div className="w-full lg:w-1/2">
          <RevealOnScroll dramatic>
            <h2
              className="mb-12 flex flex-col text-4xl uppercase leading-none tracking-tight text-white md:text-5xl"
              style={{ fontFamily: "var(--font-anton), sans-serif" }}
            >
              <span>FREQUENTLY</span>
              <span>ASKED</span>
              <span>QUESTIONS</span>
            </h2>
          </RevealOnScroll>
        </div>
      </div>

      {/* FAQ Items - full width lines with staggered reveal */}
      <div className="w-full">
        {FAQ_DATA.map((item, index) => (
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
