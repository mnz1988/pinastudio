"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavLinkItem = { href: string; label: string };

export default function NavLinks({ links }: { links: NavLinkItem[] }) {
  const pathname = usePathname();
  return (
    <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-center gap-1 md:gap-2 py-4 backdrop-blur-md bg-black/30">
      {links.map((l) => {
        const active = pathname === l.href;
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`px-3 md:px-4 py-1.5 rounded-full text-sm md:text-base transition-colors ${
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
