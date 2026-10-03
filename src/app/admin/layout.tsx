"use client";

import { usePathname } from "next/navigation";
import { AuthProvider } from "@/hooks/useAuth";
import { AdminShell } from "@/components/admin/AdminShell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  return (
    <AuthProvider>
      {isLoginPage ? <>{children}</> : <AdminShell>{children}</AdminShell>}
    </AuthProvider>
  );
}
