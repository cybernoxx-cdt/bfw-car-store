"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Search, X } from "lucide-react";
import { MobileMenu } from "./MobileMenu";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { getBusinessSettings } from "@/lib/firestore/settings";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/cars", label: "Cars" },
  { href: "/modifications", label: "Modifications" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    getBusinessSettings()
      .then((s) => setWhatsapp(s.whatsappNumber))
      .catch(() => {});
  }, []);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    router.push(`/cars?q=${encodeURIComponent(searchTerm.trim())}`);
    setSearchOpen(false);
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[100] transition-all duration-500",
          scrolled
            ? "border-b border-white/10 bg-ink-900/80 py-3 backdrop-blur-xl"
            : "border-b border-transparent bg-gradient-to-b from-black/50 to-transparent py-6"
        )}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6">
          <Link
            href="/"
            className="font-display text-lg font-bold uppercase tracking-widest2 text-bone"
          >
            Showroom<span className="text-ignition">.</span>
          </Link>

          <ul className="hidden items-center gap-9 lg:flex">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-xs font-semibold uppercase tracking-widest2 text-bone/80 transition-colors hover:text-bone"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Search cars"
              className="hidden h-10 w-10 items-center justify-center rounded-full border border-white/15 text-bone transition-colors hover:border-ignition hover:text-ignition sm:flex"
            >
              {searchOpen ? <X size={16} /> : <Search size={16} />}
            </button>
            <div className="hidden lg:block">
              <WhatsAppButton number={whatsapp} label="Enquire" />
            </div>
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-bone lg:hidden"
            >
              <Menu size={18} />
            </button>
          </div>
        </nav>

        {searchOpen && (
          <form
            onSubmit={submitSearch}
            className="mx-auto mt-3 max-w-7xl px-6"
          >
            <input
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search brand, model, category…"
              className="w-full rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm text-bone placeholder:text-bone-dim focus:border-ignition focus:outline-none"
            />
          </form>
        )}
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} links={LINKS} whatsappNumber={whatsapp} />
    </>
  );
}
