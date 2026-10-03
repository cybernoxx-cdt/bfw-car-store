"use client";

import { useState, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { useAdminGuard } from "@/hooks/useAdminGuard";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";

export function AdminShell({ children }: { children: ReactNode }) {
  const { isAdmin, loading } = useAdminGuard();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading || !isAdmin) {
    return (
      <div className="flex h-screen items-center justify-center bg-ink-900">
        <Loader2 className="animate-spin text-ignition" size={28} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink-900">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-64">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
