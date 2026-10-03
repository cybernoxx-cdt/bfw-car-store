"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Instagram, Facebook, Mail, Phone, MapPin } from "lucide-react";
import { getBusinessSettings, DEFAULT_SETTINGS } from "@/lib/firestore/settings";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import type { BusinessSettings } from "@/types";

export function Footer() {
  const [settings, setSettings] = useState<BusinessSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    getBusinessSettings().then(setSettings).catch(() => {});
  }, []);

  return (
    <footer className="border-t border-white/10 bg-ink-900">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <span className="font-display text-xl font-bold uppercase tracking-widest2 text-bone">
              {settings.businessName || "Showroom"}
              <span className="text-ignition">.</span>
            </span>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-bone-dim">
              Premium vehicles, engineered modifications, and a build process
              made for people who care about every detail.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <WhatsAppButton number={settings.whatsappNumber} variant="icon" />
              {settings.instagram && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-bone transition-colors hover:border-ignition hover:text-ignition"
                >
                  <Instagram size={16} />
                </a>
              )}
              {settings.facebook && (
                <a
                  href={settings.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-bone transition-colors hover:border-ignition hover:text-ignition"
                >
                  <Facebook size={16} />
                </a>
              )}
            </div>
          </div>

          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest2 text-bone-dim">Explore</p>
            <ul className="space-y-3 text-sm text-bone/80">
              <li><Link href="/cars" className="hover:text-ignition">All Cars</Link></li>
              <li><Link href="/modifications" className="hover:text-ignition">Modifications</Link></li>
              <li><Link href="/about" className="hover:text-ignition">About</Link></li>
              <li><Link href="/contact" className="hover:text-ignition">Contact</Link></li>
            </ul>
          </div>

          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest2 text-bone-dim">Get in touch</p>
            <ul className="space-y-3 text-sm text-bone/80">
              {settings.phone && (
                <li className="flex items-center gap-2"><Phone size={14} className="text-ignition" /> {settings.phone}</li>
              )}
              {settings.email && (
                <li className="flex items-center gap-2"><Mail size={14} className="text-ignition" /> {settings.email}</li>
              )}
              {settings.address && (
                <li className="flex items-start gap-2"><MapPin size={14} className="mt-0.5 shrink-0 text-ignition" /> {settings.address}</li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-bone-dim sm:flex-row">
          <p>© {new Date().getFullYear()} {settings.businessName || "Showroom"}. All rights reserved.</p>
          <p>{settings.businessHours}</p>
        </div>
      </div>
    </footer>
  );
}
