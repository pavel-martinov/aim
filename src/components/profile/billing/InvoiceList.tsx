"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SMOOTH_EASE, DURATION } from "@/lib/animations";
import SectionCard from "@/components/ui/SectionCard";
import type { Invoice, InvoiceStatus } from "@/types/user";

interface InvoiceListProps {
  invoices: Invoice[];
}

const STATUS_STYLES: Record<InvoiceStatus, { bg: string; text: string }> = {
  paid: { bg: "bg-[var(--color-brand)]/10", text: "text-[var(--color-brand)]" },
  pending: { bg: "bg-amber-400/10", text: "text-amber-400" },
  failed: { bg: "bg-red-400/10", text: "text-red-400" },
};

const DATE_OPTIONS: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" };

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-US", DATE_OPTIONS);

/**
 * Displays list of invoices with download links.
 */
export default function InvoiceList({ invoices }: InvoiceListProps) {
  return (
    <SectionCard delay={0.2}>
      <h3 className="mb-4 text-xs uppercase tracking-widest text-white/40 font-mono">
        Billing History
      </h3>

      {invoices.length === 0 ? (
        <p className="text-center text-white/40 font-sans">No invoices yet</p>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-lg border border-white/10 sm:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02]">
                  {["Date", "Description", "Amount", "Status", ""].map((h, i) => (
                    <th
                      key={i}
                      className={cn(
                        "px-4 py-3 text-xs uppercase tracking-widest text-white/40 font-mono",
                        i === 2 ? "text-right" : i === 3 ? "text-center" : "text-left"
                      )}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => {
                  const statusStyle = STATUS_STYLES[invoice.status];
                  return (
                    <tr
                      key={invoice.id}
                      className="border-b border-white/5 last:border-0 transition-colors hover:bg-white/[0.02]"
                    >
                      <td className="px-4 py-3 text-sm text-white/60 font-mono">{formatDate(invoice.date)}</td>
                      <td className="px-4 py-3 text-sm text-white font-sans">{invoice.description}</td>
                      <td className="px-4 py-3 text-right text-sm text-white font-mono">
                        ${invoice.amount.toFixed(2)} {invoice.currency}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={cn("inline-block rounded-full px-2 py-0.5 text-xs capitalize font-mono", statusStyle.bg, statusStyle.text)}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <a href={invoice.downloadUrl} className="text-sm text-white/60 font-sans transition-colors hover:text-[var(--color-brand)]">
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
              return (
                <div key={invoice.id} className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-white font-sans">{invoice.description}</p>
                      <p className="mt-1 text-xs text-white/40 font-mono">{formatDate(invoice.date)}</p>
                    </div>
                    <span className={cn("rounded-full px-2 py-0.5 text-xs capitalize font-mono", statusStyle.bg, statusStyle.text)}>
                      {invoice.status}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
                    <span className="text-lg text-white font-mono">${invoice.amount.toFixed(2)}</span>
                    <a href={invoice.downloadUrl} className="text-sm text-[var(--color-brand)] font-sans transition-opacity hover:opacity-80">
                      Download
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </SectionCard>
  );
}
