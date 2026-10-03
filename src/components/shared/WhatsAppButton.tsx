"use client";

import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface WhatsAppButtonProps {
  number: string;
  message?: string;
  label?: string;
  variant?: "solid" | "outline" | "icon";
  className?: string;
}

export function WhatsAppButton({
  number,
  message = "Hello, I'd like to know more about your vehicles.",
  label = "Chat on WhatsApp",
  variant = "solid",
  className,
}: WhatsAppButtonProps) {
  const href = number
    ? `https://wa.me/${number.replace(/[^\d]/g, "")}?text=${encodeURIComponent(message)}`
    : undefined;

  if (variant === "icon") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-bone transition-colors hover:border-ignition hover:text-ignition",
          !href && "pointer-events-none opacity-40",
          className
        )}
      >
        <MessageCircle size={18} />
      </a>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-6 py-3 text-xs font-semibold uppercase tracking-widest2 transition-all duration-300",
        variant === "solid"
          ? "bg-ignition text-ink-900 hover:bg-ignition-soft"
          : "border border-white/20 text-bone hover:border-ignition hover:text-ignition",
        !href && "pointer-events-none opacity-40",
        className
      )}
    >
      <MessageCircle size={16} />
      {label}
    </a>
  );
}
