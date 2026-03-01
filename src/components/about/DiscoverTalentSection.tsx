"use client";

import { motion } from "framer-motion";
import { DRAMATIC_EASE, SMOOTH_EASE } from "@/lib/animations";

export default function DiscoverTalentSection() {
  return (
    <section
      className="relative w-full bg-white py-24 lg:py-40"
      data-header-theme="light"
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-16 px-6 lg:flex-row lg:items-start lg:gap-24 lg:px-12">
        
        {/* Left Column (Sticky Text) */}
        <div className="flex w-full flex-col gap-8 lg:sticky lg:top-40 lg:w-1/2">
          <motion.span
            className="text-xs uppercase tracking-[0.3em] text-black/50"
            style={{ fontFamily: "var(--font-geist-mono), monospace" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: DRAMATIC_EASE }}
          >
            Worldwide
          </motion.span>
          
          <motion.h2
            className="flex flex-col text-[42px] uppercase leading-[1.1] tracking-tight text-black lg:text-[62px]"
            style={{ fontFamily: "var(--font-anton), sans-serif" }}
          >
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: DRAMATIC_EASE, delay: 0.1 }}
            >
              Discover
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: DRAMATIC_EASE, delay: 0.2 }}
            >
              hidden talent
            </motion.span>
            <motion.span
              className="text-black/30"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: DRAMATIC_EASE, delay: 0.3 }}
            >
              world wide
            </motion.span>
          </motion.h2>

          <motion.p
            className="mt-4 max-w-lg text-sm uppercase leading-[1.5] text-black/70 md:text-lg md:leading-[1.25]"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: SMOOTH_EASE, delay: 0.4 }}
          >
            AIM is building the most comprehensive database of upcoming football talent. 
            By integrating both qualitative and quantitative assessments, AIM will help 
            make smarter, evidence-based recruitment and talent development decisions.
          </motion.p>
        </div>

        {/* Right Column (Scrolling Visuals) */}
        <div className="flex w-full flex-col gap-6 lg:w-1/2 lg:pt-12">
          {/* Card 1 */}
          <motion.div
            className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#0a0a0a]"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: DRAMATIC_EASE }}
          >
            {/* Abstract Graphic */}
            <div className="absolute inset-0 opacity-40 mix-blend-screen"
                 style={{
                   background: "radial-gradient(circle at 70% 30%, var(--color-brand) 0%, transparent 60%)"
                 }}
            />
            <div className="absolute inset-0 flex items-center justify-center border border-white/10 rounded-2xl">
              <span className="text-white/20 uppercase tracking-widest text-sm" style={{ fontFamily: "var(--font-geist-mono), monospace" }}>Database Matrix</span>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-[#050505]"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: DRAMATIC_EASE }}
          >
             {/* Abstract Graphic */}
             <div className="absolute inset-0 opacity-20"
                 style={{
                   backgroundImage: "linear-gradient(to right, var(--color-brand) 1px, transparent 1px), linear-gradient(to bottom, var(--color-brand) 1px, transparent 1px)",
                   backgroundSize: "40px 40px"
                 }}
            />
             <div className="absolute inset-0 flex items-center justify-center border border-white/5 rounded-2xl">
              <span className="text-white/20 uppercase tracking-widest text-sm" style={{ fontFamily: "var(--font-geist-mono), monospace" }}>Quantitative Data</span>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
