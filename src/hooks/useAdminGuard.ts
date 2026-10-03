"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

/** Redirects away from protected /admin/* pages when the visitor isn't a
 * signed-in admin. This is a UX guard, not the security boundary — see
 * firestore.rules for the enforced one. */
export function useAdminGuard() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (pathname === "/admin/login") return;
    if (!user || !isAdmin) {
      router.replace("/admin/login");
    }
  }, [user, isAdmin, loading, pathname, router]);

  return { user, isAdmin, loading };
}
