"use client";

import { motion, AnimatePresence } from "framer-motion";
import { DRAMATIC_EASE, DURATION } from "@/lib/animations";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** Max width class, defaults to "max-w-md" */
  maxWidth?: string;
}

/**
 * Reusable modal with animated backdrop and centered container.
 * Children are rendered inside the container.
 */
export default function Modal({ isOpen, onClose, children, maxWidth = "max-w-md" }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.fast }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm cursor-pointer"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: DURATION.standard, ease: DRAMATIC_EASE }}
            className={`fixed inset-x-4 top-1/2 z-50 mx-auto -translate-y-1/2 rounded-2xl border border-white/10 bg-[var(--background)] p-6 sm:inset-x-auto ${maxWidth}`}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
