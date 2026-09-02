import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const fixedLinks = [
  { href: "/", fallback: "خانه" },
  { href: "/about", fallback: "درباره من" },
  { href: "/portfolio", fallback: "پورتفولیو" },
  { href: "/contact", fallback: "ارتباط با من" },
];

async function saveLabels(formData: FormData) {
  "use server";
  for (let i = 0; i < fixedLinks.length; i++) {
    const { href } = fixedLinks[i];
    const label = formData.get(href) as string;
    await prisma.menuItem.upsert({
      where: { href },
      update: { label },
      create: { href, label, order: i },
    });
  }
  revalidatePath("/");
  revalidatePath("/admin/menu");
}

export default async function AdminMenuPage() {
  const items = await prisma.menuItem.findMany();
  const map = Object.fromEntries(items.map((i: any) => [i.href, i.label]));

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-2">متن منوی اصلی</h1>
      <p className="text-white/40 text-sm mb-8">
        متن هر آیتم منو را به فارسی یا انگلیسی بنویسید — لینک هرکدام ثابت است، فقط متن نمایشی تغییر می‌کند. توجه: نوشته‌های منو همیشه وسط‌چین می‌مانند، صرف‌نظر از زبان.
      </p>
      <form action={saveLabels} className="flex flex-col gap-4">
        {fixedLinks.map((l) => (
          <label key={l.href} className="flex flex-col gap-1 text-sm">
            <span className="text-white/60" dir="ltr">
              {l.href}
            </span>
            <input
              name={l.href}
              defaultValue={map[l.href] || l.fallback}
              required
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-white/40"
            />
          </label>
        ))}
        <button className="self-start px-6 py-3 rounded-full bg-white text-black font-medium">
          ذخیره تغییرات
        </button>
      </form>
    </div>
  );
}
