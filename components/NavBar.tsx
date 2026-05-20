"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, BarChart2, Library, PlusCircle } from "lucide-react";

const links = [
  { href: "/", label: "Today", icon: BookOpen },
  { href: "/dashboard", label: "Progress", icon: BarChart2 },
  { href: "/cards", label: "Cards", icon: Library },
  { href: "/add", label: "Add", icon: PlusCircle },
];

export function NavBar() {
  const path = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-[var(--color-border)] pb-safe">
      <div className="flex">
        {links.map(({ href, label, icon: Icon }) => {
          const active = path === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
                active
                  ? "text-[var(--color-accent)]"
                  : "text-[var(--color-muted)]"
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
