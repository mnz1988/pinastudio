import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import PageTransition from "@/components/PageTransition";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";

const siteDefaults = {
  site_title: "Portfolio",
  site_description: "Portfolio & personal website",
  site_favicon: "/favicon.ico",
  site_transition_logo: "/logo.svg",
};

const defaultMenu = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/contact", label: "Contact" },
];

async function getMenu() {
  try {
    const rows = await prisma.menuItem.findMany({ orderBy: { order: "asc" } });
    if (rows.length) return rows.map((r: any) => ({ href: r.href, label: r.label }));
  } catch {}
  return defaultMenu;
}

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings(Object.keys(siteDefaults), siteDefaults);
  return {
    title: s.site_title,
    description: s.site_description,
    icons: { icon: s.site_favicon },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [menu, siteSettings] = await Promise.all([
    getMenu(),
    getSettings(Object.keys(siteDefaults), siteDefaults),
  ]);

  return (
    <html lang="en" dir="ltr" className="h-full">
      <body className="min-h-full flex flex-col bg-black text-white antialiased">
        <Nav items={menu} />
        <PageTransition logoSrc={siteSettings.site_transition_logo}>
          <main className="flex-1">{children}</main>
        </PageTransition>
      </body>
    </html>
  );
}
