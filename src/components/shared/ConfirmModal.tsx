"use client";

import { useEffect, useRef } from "react";
import { AlertTriangle } from "lucide-react";
import { modalOpen, modalClose } from "@/lib/animations";

interface ConfirmModalProps {
  open: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  open,
  title = "Are you sure?",
  message,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  destructive = true,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && overlayRef.current && panelRef.current) {
      modalOpen(overlayRef.current, panelRef.current);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[150] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={panelRef}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-ink-700 p-6 shadow-2xl"
      >
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-signal-stop/10">
          <AlertTriangle size={20} className="text-signal-stop" />
        </div>
        <h3 className="font-display text-xl font-semibold text-bone">{title}</h3>
        <p className="mt-2 text-sm text-bone-dim">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-bone transition-colors hover:bg-white/5 disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50 ${
              destructive ? "bg-signal-stop text-white hover:bg-red-600" : "bg-ignition text-ink-900 hover:bg-ignition-soft"
            }`}
          >
            {loading ? "Please wait…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
