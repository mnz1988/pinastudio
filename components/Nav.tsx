"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type MenuLink = { href: string; label: string };

// Note: menu items are always center-aligned and never flip direction,
// regardless of whether the admin-entered label is Persian or English —
// per design, only the label text itself changes; layout stays centered.
export default function Nav({ items }: { items: MenuLink[] }) {
  const pathname = usePathname();
  return (
    <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-center gap-1 md:gap-2 py-4 backdrop-blur-md bg-black/30">
      {items.map((l) => {
        const active = pathname === l.href;
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`px-3 md:px-4 py-1.5 rounded-full text-sm md:text-base text-center transition-colors ${
              active ? "bg-white text-black" : "text-white/80 hover:text-white"
            }`}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
