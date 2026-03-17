"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCurrency } from "@/lib/context/CurrencyContext";
import { CURRENCIES, CURRENCY_CONFIG, type Currency } from "@/lib/constants/plans";
import { cn } from "@/lib/utils";
import { DURATION, DRAMATIC_EASE } from "@/lib/animations";

/**
 * Compact currency selector dropdown.
 * Displays current currency with flag and allows switching between supported currencies.
 */
export default function CurrencySelector() {
  const { currency, setCurrency, isDetecting } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentConfig = CURRENCY_CONFIG[currency];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (selected: Currency) => {
    setCurrency(selected);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isDetecting}
        className={cn(
          "flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5",
          "text-xs font-medium uppercase tracking-wider text-white/70",
          "transition-all duration-[650ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
          "hover:border-white/20 hover:bg-white/10 hover:text-white",
          isDetecting && "opacity-50 cursor-wait"
        )}
        style={{ fontFamily: "var(--font-geist-mono), monospace" }}
        aria-label="Select currency"
        aria-expanded={isOpen}
      >
        <span className="text-sm">{currentConfig.flag}</span>
        <span>{currency}</span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          className={cn(
            "transition-transform duration-300",
            isOpen && "rotate-180"
          )}
        >
          <path
            d="M2 3.5L5 6.5L8 3.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: DURATION.fast, ease: DRAMATIC_EASE }}
            className={cn(
              "absolute right-0 top-full z-50 mt-2 min-w-[140px]",
              "rounded-xl border border-white/10 bg-[#0a0a0a] p-1.5",
              "shadow-xl shadow-black/50"
            )}
          >
            {CURRENCIES.map((code) => {
              const config = CURRENCY_CONFIG[code];
              const isSelected = code === currency;

              return (
                <button
                  key={code}
                  onClick={() => handleSelect(code)}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-lg px-3 py-2",
                    "text-left text-xs font-medium uppercase tracking-wider",
                    "transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
                    isSelected
                      ? "bg-[var(--color-brand)] text-black"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  )}
                  style={{ fontFamily: "var(--font-geist-mono), monospace" }}
                >
                  <span className="text-sm">{config.flag}</span>
                  <span className="flex-1">{code}</span>
                  {isSelected && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M2 6L5 9L10 3"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
