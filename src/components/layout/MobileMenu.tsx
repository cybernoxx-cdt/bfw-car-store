"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { X } from "lucide-react";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { prefersReducedMotion } from "@/lib/animations";

interface NavLink {
  href: string;
  label: string;
}

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  links: NavLink[];
  whatsappNumber: string;
}

export function MobileMenu({ open, onClose, links, whatsappNumber }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!panelRef.current) return;
    const reduced = prefersReducedMotion();
    const items = linksRef.current?.querySelectorAll("li") ?? [];

    if (open) {
      document.body.style.overflow = "hidden";
      const tl = gsap.timeline();
      tl.fromTo(
        panelRef.current,
        { clipPath: "inset(0 0 100% 0)" },
        { clipPath: "inset(0 0 0% 0)", duration: reduced ? 0.2 : 0.6, ease: "power3.inOut" }
      );
      tl.fromTo(
        items,
        { y: reduced ? 0 : 24, opacity: 0 },
        { y: 0, opacity: 1, duration: reduced ? 0.15 : 0.5, stagger: reduced ? 0 : 0.06, ease: "power3.out" },
        reduced ? "<" : "-=0.25"
      );
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div
      ref={panelRef}
      className={`fixed inset-0 z-[250] flex flex-col bg-ink-900/98 backdrop-blur-md ${
        open ? "pointer-events-auto" : "pointer-events-none opacity-0"
      }`}
      style={{ clipPath: open ? undefined : "inset(0 0 100% 0)" }}
      aria-hidden={!open}
    >
      <div className="flex items-center justify-between px-6 py-6">
        <span className="font-display text-lg font-bold uppercase tracking-widest2 text-bone">
          Showroom<span className="text-ignition">.</span>
        </span>
        <button
          onClick={onClose}
          aria-label="Close menu"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-bone"
        >
          <X size={18} />
        </button>
      </div>

      <ul ref={linksRef} className="flex flex-1 flex-col justify-center gap-2 px-8">
        {links.map((link) => (
          <li key={link.href} className="overflow-hidden border-b border-white/5 py-3">
            <Link
              href={link.href}
              onClick={onClose}
              className="font-display text-4xl font-bold uppercase text-bone transition-colors hover:text-ignition"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="px-8 pb-10">
        <WhatsAppButton number={whatsappNumber} className="w-full justify-center" />
      </div>
    </div>
  );
}
