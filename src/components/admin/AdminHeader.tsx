"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

function titleCase(segment: string) {
  if (segment.startsWith("[")) return "Detail";
  return segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function AdminHeader({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const { user } = useAuth();

  const segments = (pathname ?? "").split("/").filter(Boolean).slice(1); // drop "admin"
  const crumbs = ["Admin", ...segments.map(titleCase)];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-[#0d0d10]/90 px-6 py-4 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="text-bone lg:hidden" aria-label="Open sidebar">
          <Menu size={20} />
        </button>
        <nav aria-label="Breadcrumb" className="text-sm text-bone-dim">
          {crumbs.map((c, i) => (
            <span key={i}>
              {i > 0 && <span className="mx-2 text-bone-dim/40">/</span>}
              <span className={i === crumbs.length - 1 ? "text-bone" : ""}>{c}</span>
            </span>
          ))}
        </nav>
      </div>
      {user?.email && <span className="hidden text-sm text-bone-dim sm:block">{user.email}</span>}
    </header>
  );
}
