"use client";

import { usePathname } from "next/navigation";

/**
 * Wraps page content in <main>. Every route gets top padding to clear the
 * floating header pills — except the homepage, whose walkthrough hero is
 * full-bleed and starts under the (initially transparent) header.
 */
export function MainShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <main className={isHome ? "" : "pt-28 lg:pt-32"}>{children}</main>
  );
}
