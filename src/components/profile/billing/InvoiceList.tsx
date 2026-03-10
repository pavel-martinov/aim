"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SMOOTH_EASE, DURATION } from "@/lib/animations";
import type { Invoice, InvoiceStatus } from "@/types/user";

interface InvoiceListProps {
  invoices: Invoice[];
}

const STATUS_STYLES: Record<InvoiceStatus, { bg: string; text: string }> = {
  paid: { bg: "bg-[var(--color-brand)]/10", text: "text-[var(--color-brand)]" },
  pending: { bg: "bg-amber-400/10", text: "text-amber-400" },
  failed: { bg: "bg-red-400/10", text: "text-red-400" },
};

/**
 * Displays list of invoices with download links.
 */
export default function InvoiceList({ invoices }: InvoiceListProps) {
  if (invoices.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.standard, ease: SMOOTH_EASE, delay: 0.2 }}
        className="rounded-2xl border border-white/10 bg-white/[0.02] p-6"
      >
        <h3
          className="text-xs uppercase tracking-widest text-white/40"
          style={{ fontFamily: "var(--font-geist-mono), monospace" }}
        >
          Billing History
        </h3>
        <p
          className="mt-4 text-center text-white/40"
          style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
        >
          No invoices yet
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.standard, ease: SMOOTH_EASE, delay: 0.2 }}
      className="rounded-2xl border border-white/10 bg-white/[0.02] p-6"
    >
      <h3
        className="mb-4 text-xs uppercase tracking-widest text-white/40"
        style={{ fontFamily: "var(--font-geist-mono), monospace" }}
      >
        Billing History
      </h3>

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-lg border border-white/10 sm:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.02]">
              <th
                className="px-4 py-3 text-left text-xs uppercase tracking-widest text-white/40"
                style={{ fontFamily: "var(--font-geist-mono), monospace" }}
              >
                Date
              </th>
              <th
                className="px-4 py-3 text-left text-xs uppercase tracking-widest text-white/40"
                style={{ fontFamily: "var(--font-geist-mono), monospace" }}
              >
                Description
              </th>
              <th
                className="px-4 py-3 text-right text-xs uppercase tracking-widest text-white/40"
                style={{ fontFamily: "var(--font-geist-mono), monospace" }}
              >
                Amount
              </th>
              <th
                className="px-4 py-3 text-center text-xs uppercase tracking-widest text-white/40"
                style={{ fontFamily: "var(--font-geist-mono), monospace" }}
              >
                Status
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => {
              const statusStyle = STATUS_STYLES[invoice.status];
              const date = new Date(invoice.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });

              return (
                <tr
                  key={invoice.id}
                  className="border-b border-white/5 last:border-0 transition-colors hover:bg-white/[0.02]"
                >
                  <td
                    className="px-4 py-3 text-sm text-white/60"
                    style={{ fontFamily: "var(--font-geist-mono), monospace" }}
                  >
                    {date}
                  </td>
                  <td
                    className="px-4 py-3 text-sm text-white"
                    style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
                  >
                    {invoice.description}
                  </td>
                  <td
                    className="px-4 py-3 text-right text-sm text-white"
                    style={{ fontFamily: "var(--font-geist-mono), monospace" }}
                  >
                    ${invoice.amount.toFixed(2)} {invoice.currency}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={cn(
                        "inline-block rounded-full px-2 py-0.5 text-xs capitalize",
                        statusStyle.bg,
                        statusStyle.text
                      )}
                      style={{ fontFamily: "var(--font-geist-mono), monospace" }}
                    >
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <a
                      href={invoice.downloadUrl}
                      className="text-sm text-white/60 transition-colors hover:text-[var(--color-brand)]"
                      style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
                    >
                      Download
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 sm:hidden">
        {invoices.map((invoice) => {
          const statusStyle = STATUS_STYLES[invoice.status];
          const date = new Date(invoice.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });

          return (
            <div
              key={invoice.id}
              className="rounded-lg border border-white/10 bg-white/[0.02] p-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p
                    className="text-sm text-white"
                    style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
                  >
                    {invoice.description}
                  </p>
                  <p
                    className="mt-1 text-xs text-white/40"
                    style={{ fontFamily: "var(--font-geist-mono), monospace" }}
                  >
                    {date}
                  </p>
                </div>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs capitalize",
                    statusStyle.bg,
                    statusStyle.text
                  )}
                  style={{ fontFamily: "var(--font-geist-mono), monospace" }}
                >
                  {invoice.status}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
                <span
                  className="text-lg text-white"
                  style={{ fontFamily: "var(--font-geist-mono), monospace" }}
                >
                  ${invoice.amount.toFixed(2)}
                </span>
                <a
                  href={invoice.downloadUrl}
                  className="text-sm text-[var(--color-brand)] transition-opacity hover:opacity-80"
                  style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
                >
                  Download
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
