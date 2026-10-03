"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown, X, MessageCircle, Trash2 } from "lucide-react";
import type { Modification } from "@/types";
import { formatMoney } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

interface BuildSummaryProps {
  carName: string;
  basePrice: number;
  currency: string;
  selectedMods: Modification[];
  onRemove: (id: string) => void;
  onClear: () => void;
  onBuy: () => void;
  submitting?: boolean;
}

function ModList({
  selectedMods,
  currency,
  onRemove,
}: {
  selectedMods: Modification[];
  currency: string;
  onRemove: (id: string) => void;
}) {
  if (selectedMods.length === 0) {
    return <p className="text-sm text-bone-dim">No modifications selected yet.</p>;
  }
  return (
    <ul className="space-y-3">
      {selectedMods.map((mod) => (
        <li key={mod.id} className="flex items-center justify-between gap-3 text-sm">
          <span className="truncate text-bone/90">{mod.name}</span>
          <div className="flex shrink-0 items-center gap-2">
            <span className="text-bone-dim">{formatMoney(mod.price, currency)}</span>
            <button
              onClick={() => onRemove(mod.id)}
              aria-label={`Remove ${mod.name}`}
              className="text-bone-dim hover:text-signal-stop"
            >
              <X size={14} />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function BuildSummary({
  carName,
  basePrice,
  currency,
  selectedMods,
  onRemove,
  onClear,
  onBuy,
  submitting,
}: BuildSummaryProps) {
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const total = basePrice + selectedMods.reduce((sum, m) => sum + m.price, 0);

  return (
    <>
      {/* Desktop sticky sidebar */}
      <div className="sticky top-28 hidden rounded-2xl border border-white/10 bg-ink-700/80 p-6 backdrop-blur-xl lg:block">
        <p className="text-xs font-semibold uppercase tracking-widest2 text-bone-dim">Base Vehicle</p>
        <p className="mt-1 font-display text-xl font-bold uppercase text-bone">{carName}</p>
        <p className="mt-1 text-sm text-bone-dim">{formatMoney(basePrice, currency)}</p>

        <div className="my-6 border-t border-white/10" />

        <p className="mb-3 text-xs font-semibold uppercase tracking-widest2 text-bone-dim">
          Selected Modifications
        </p>
        <ModList selectedMods={selectedMods} currency={currency} onRemove={onRemove} />

        <div className="my-6 border-t border-white/10" />

        <div className="flex items-baseline justify-between">
          <span className="text-xs font-semibold uppercase tracking-widest2 text-bone-dim">Total</span>
          <span className="font-display text-2xl font-bold text-ignition">{formatMoney(total, currency)}</span>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={onBuy}
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-ignition px-6 py-3.5 text-xs font-semibold uppercase tracking-widest2 text-ink-900 transition-colors hover:bg-ignition-soft disabled:opacity-60"
          >
            <MessageCircle size={15} />
            {submitting ? "Preparing…" : "Buy / Contact Seller"}
          </button>
          <button
            onClick={onClear}
            disabled={selectedMods.length === 0}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3 text-xs font-semibold uppercase tracking-widest2 text-bone-dim transition-colors hover:text-bone disabled:opacity-40"
          >
            <Trash2 size={13} /> Clear Build
          </button>
        </div>
      </div>

      {/* Mobile fixed bottom summary */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink-800/95 backdrop-blur-xl lg:hidden">
        {mobileExpanded && (
          <div className="max-h-[45vh] overflow-y-auto px-5 pt-5">
            <ModList selectedMods={selectedMods} currency={currency} onRemove={onRemove} />
            <button
              onClick={onClear}
              disabled={selectedMods.length === 0}
              className="mt-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest2 text-bone-dim disabled:opacity-40"
            >
              <Trash2 size={13} /> Clear Build
            </button>
          </div>
        )}
        <div className="flex items-center gap-3 px-5 py-4">
          <button
            onClick={() => setMobileExpanded((v) => !v)}
            className="flex flex-1 items-center justify-between text-left"
            aria-expanded={mobileExpanded}
          >
            <span>
              <span className="block text-[10px] font-semibold uppercase tracking-widest2 text-bone-dim">
                Total ({selectedMods.length} added)
              </span>
              <span className="font-display text-lg font-bold text-ignition">{formatMoney(total, currency)}</span>
            </span>
            {mobileExpanded ? <ChevronDown size={18} className="text-bone-dim" /> : <ChevronUp size={18} className="text-bone-dim" />}
          </button>
          <button
            onClick={onBuy}
            disabled={submitting}
            className={cn(
              "inline-flex shrink-0 items-center gap-2 rounded-full bg-ignition px-5 py-3 text-xs font-semibold uppercase tracking-widest2 text-ink-900 disabled:opacity-60"
            )}
          >
            <MessageCircle size={14} />
            {submitting ? "…" : "Contact"}
          </button>
        </div>
      </div>
    </>
  );
}
