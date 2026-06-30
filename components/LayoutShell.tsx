"use client";

import { usePathname } from "next/navigation";
import { NavBar } from "./NavBar";

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const inSession = usePathname().startsWith("/session");

  return (
    <>
      <main className={`flex-1 ${inSession ? "" : "pb-20"}`}>{children}</main>
      {!inSession && <NavBar />}
    </>
  );
}
