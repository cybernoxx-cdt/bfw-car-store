"use client";

import { useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Preloader } from "./Preloader";
import { useLenis } from "@/hooks/useLenis";

/** Public-site chrome: preloader + navbar + footer + smooth scroll. Admin
 * routes render their own sidebar/header layout instead, so this component
 * simply steps out of the way for any /admin/* path. */
export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const [preloaderDone, setPreloaderDone] = useState(false);

  useLenis();

  if (isAdmin) return <>{children}</>;

  return (
    <>
      {!preloaderDone && <Preloader onDone={() => setPreloaderDone(true)} />}
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
