"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { X, Plus, Check } from "lucide-react";
import type { Modification } from "@/types";
import { cldResponsive } from "@/lib/cloudinary";
import { formatMoney } from "@/lib/whatsapp";
import { modalOpen, modalClose } from "@/lib/animations";

interface ModificationModalProps {
  mod: Modification | null;
  carName: string;
  selected: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export function ModificationModal({ mod, carName, selected, onToggle, onClose }: ModificationModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mod && overlayRef.current && panelRef.current) {
      modalOpen(overlayRef.current, panelRef.current);
    }
  }, [mod]);

  const handleClose = () => {
    if (overlayRef.current && panelRef.current) {
      modalClose(overlayRef.current, panelRef.current, onClose);
    } else {
      onClose();
    }
  };

  if (!mod) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[180] flex items-end justify-center bg-black/75 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      onClick={handleClose}
    >
      <div
        ref={panelRef}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-white/10 bg-ink-700 sm:rounded-3xl"
      >
        <div className="relative aspect-[16/9] w-full bg-ink-600">
          {mod.image && (
            <Image src={cldResponsive(mod.image, 1200)} alt={mod.name} fill className="object-cover" />
          )}
          <button
            onClick={handleClose}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-bone backdrop-blur-md"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest2 text-ignition">
            {mod.available ? "In Stock" : "Currently Unavailable"}
          </p>
          <h3 className="mt-2 font-display text-3xl font-bold uppercase text-bone">{mod.name}</h3>
          <p className="mt-3 text-sm leading-relaxed text-bone-dim">{mod.description}</p>

          <div className="mt-6 rounded-xl border border-white/10 bg-ink-900/50 p-4 text-sm text-bone-dim">
            Fits: <span className="text-bone">{carName}</span>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-6">
            <span className="font-display text-2xl font-semibold text-ignition">
              {formatMoney(mod.price, mod.currency)}
            </span>
            <button
              onClick={onToggle}
              disabled={!mod.available}
              className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-xs font-semibold uppercase tracking-widest2 transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                selected
                  ? "bg-white/10 text-bone hover:bg-signal-stop/20 hover:text-signal-stop"
                  : "bg-ignition text-ink-900 hover:bg-ignition-soft"
              }`}
            >
              {selected ? (<><Check size={15} /> Remove from Build</>) : (<><Plus size={15} /> Add to Build</>)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
