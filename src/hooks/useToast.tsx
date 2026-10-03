"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

type ToastKind = "success" | "error" | "info";
interface ToastItem {
  id: number;
  kind: ToastKind;
  message: string;
}

interface ToastContextValue {
  push: (message: string, kind?: ToastKind) => void;
}

const ToastContext = createContext<ToastContextValue>({ push: () => {} });

let idCounter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const push = useCallback((message: string, kind: ToastKind = "success") => {
    const id = ++idCounter;
    setToasts((t) => [...t, { id, kind, message }]);
    setTimeout(() => {
      setToasts((t) => t.filter((item) => item.id !== id));
    }, 4000);
  }, []);

  const remove = (id: number) => setToasts((t) => t.filter((item) => item.id !== id));

  const icon = (kind: ToastKind) =>
    kind === "success" ? (
      <CheckCircle2 size={18} className="text-signal-go shrink-0" />
    ) : kind === "error" ? (
      <XCircle size={18} className="text-signal-stop shrink-0" />
    ) : (
      <Info size={18} className="text-bone-dim shrink-0" />
    );

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[200] flex w-[min(360px,calc(100vw-2.5rem))] flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className="flex items-start gap-2 rounded-xl border border-white/10 bg-ink-700/95 px-4 py-3 text-sm text-bone shadow-2xl backdrop-blur-md animate-[fadeUp_.25s_ease]"
          >
            {icon(t.kind)}
            <p className="flex-1 leading-snug">{t.message}</p>
            <button
              onClick={() => remove(t.id)}
              className="text-bone-dim hover:text-bone"
              aria-label="Dismiss notification"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
