import Link from "next/link";
import { signOut } from "@/auth";

const links = [
  { href: "/admin", label: "داشبورد" },
  { href: "/admin/site", label: "تنظیمات کلی سایت" },
  { href: "/admin/projects", label: "پروژه‌ها" },
  { href: "/admin/home", label: "صفحه اول" },
  { href: "/admin/hero-texts", label: "متن‌های چرخشی" },
  { href: "/admin/about", label: "درباره من" },
  { href: "/admin/contact", label: "ارتباط با من" },
  { href: "/admin/menu", label: "متن منو" },
  { href: "/admin/messages", label: "پیام‌ها" },
  { href: "/admin/orders", label: "سفارش‌ها" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div dir="rtl" lang="fa" className="min-h-dvh flex flex-col md:flex-row bg-neutral-950 text-white">
      {/* Mobile top nav: horizontal scroll bar, always visible on small screens */}
      <div className="md:hidden sticky top-0 z-40 bg-neutral-950 border-b border-white/10">
        <div className="flex items-center justify-between px-4 pt-4">
          <h2 className="text-base font-bold">پنل ادمین</h2>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button className="text-xs text-red-400 py-1 px-2">خروج</button>
          </form>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-4 py-3 no-scrollbar">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="whitespace-nowrap py-1.5 px-3 rounded-full bg-white/5 hover:bg-white/10 text-xs shrink-0"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 shrink-0 border-l border-white/10 p-6 flex-col gap-2">
        <h2 className="text-lg font-bold mb-6">پنل ادمین</h2>
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="py-2 px-3 rounded-lg hover:bg-white/10 text-sm">
            {l.label}
          </Link>
        ))}
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
          className="mt-auto"
        >
          <button className="w-full py-2 px-3 rounded-lg hover:bg-white/10 text-sm text-right text-red-400">
            خروج
          </button>
        </form>
      </aside>

      <main className="flex-1 p-4 md:p-10 overflow-x-auto">{children}</main>
    </div>
  );
}
