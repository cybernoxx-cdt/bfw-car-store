"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import {
  LayoutDashboard,
  Car,
  Wrench,
  Tags,
  Users,
  UserCircle,
  Settings,
  ImageIcon,
  LogOut,
  X,
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/cars", label: "Cars", icon: Car },
  { href: "/admin/modifications", label: "Modifications", icon: Wrench },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/leads", label: "Leads", icon: Users },
  { href: "/admin/about", label: "About", icon: UserCircle },
  { href: "/admin/settings", label: "Business Settings", icon: Settings },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
];

export function AdminSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/admin/login");
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/10 bg-[#0d0d10] transition-transform duration-300 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-6 py-6">
          <span className="font-display text-lg font-bold uppercase tracking-widest2 text-bone">
            Admin<span className="text-ignition">.</span>
          </span>
          <button onClick={onClose} className="text-bone-dim lg:hidden" aria-label="Close sidebar">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname?.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active ? "bg-ignition/15 text-ignition" : "text-bone-dim hover:bg-white/5 hover:text-bone"
                )}
              >
                <Icon size={17} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-bone-dim transition-colors hover:bg-signal-stop/10 hover:text-signal-stop"
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
