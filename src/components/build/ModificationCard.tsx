"use client";

import Image from "next/image";
import { Plus, Check, Info } from "lucide-react";
import type { Modification } from "@/types";
import { cldResponsive } from "@/lib/cloudinary";
import { formatMoney } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

interface ModificationCardProps {
  mod: Modification;
  selected: boolean;
  onToggle: () => void;
  onViewDetail: () => void;
}

export function ModificationCard({ mod, selected, onToggle, onViewDetail }: ModificationCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-ink-700/60 transition-colors",
        selected ? "border-ignition" : "border-white/10 hover:border-white/25"
      )}
    >
      <button
        onClick={onViewDetail}
        className="relative block aspect-[4/3] w-full overflow-hidden bg-ink-600"
        aria-label={`View details for ${mod.name}`}
      >
        {mod.image ? (
          <Image
            src={cldResponsive(mod.image, 600)}
            alt={mod.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-bone-dim">
            <Info size={22} />
          </div>
        )}
        <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-bone backdrop-blur-md">
          <Info size={13} />
        </span>
      </button>

      <div className="p-4">
        <h4 className="font-display text-base font-semibold uppercase leading-snug text-bone">{mod.name}</h4>
        <p className="mt-1 line-clamp-2 text-xs text-bone-dim">{mod.description}</p>

        <div className="mt-4 flex items-center justify-between">
          <span className="font-display text-base font-semibold text-ignition">
            {formatMoney(mod.price, mod.currency)}
          </span>
          <button
            onClick={onToggle}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-widest2 transition-colors",
              selected
                ? "bg-white/10 text-bone hover:bg-signal-stop/20 hover:text-signal-stop"
                : "bg-ignition text-ink-900 hover:bg-ignition-soft"
            )}
          >
            {selected ? (
              <>
                <Check size={13} /> Remove
              </>
            ) : (
              <>
                <Plus size={13} /> Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
