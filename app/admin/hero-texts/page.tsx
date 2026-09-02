import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function addText(formData: FormData) {
  "use server";
  const count = await prisma.heroText.count();
  await prisma.heroText.create({
    data: {
      content: formData.get("content") as string,
      lang: formData.get("lang") as string,
      device: (formData.get("device") as string) || "all",
      fontSize: (formData.get("fontSize") as string) || "lg",
      position: (formData.get("position") as string) || "bottom-center",
      order: count,
    },
  });
  revalidatePath("/admin/hero-texts");
  revalidatePath("/");
}

async function updateText(id: string, formData: FormData) {
  "use server";
  await prisma.heroText.update({
    where: { id },
    data: {
      content: formData.get("content") as string,
      lang: formData.get("lang") as string,
      device: (formData.get("device") as string) || "all",
      fontSize: (formData.get("fontSize") as string) || "lg",
      position: (formData.get("position") as string) || "bottom-center",
    },
  });
  revalidatePath("/admin/hero-texts");
  revalidatePath("/");
}

async function deleteText(id: string) {
  "use server";
  await prisma.heroText.delete({ where: { id } });
  revalidatePath("/admin/hero-texts");
  revalidatePath("/");
}

async function toggleText(id: string, active: boolean) {
  "use server";
  await prisma.heroText.update({ where: { id }, data: { active } });
  revalidatePath("/admin/hero-texts");
  revalidatePath("/");
}

const deviceLabel: Record<string, string> = {
  all: "هر دو",
  mobile: "فقط موبایل",
  desktop: "فقط دسکتاپ",
};

const fontSizeOptions = [
  { value: "sm", label: "کوچک" },
  { value: "md", label: "متوسط" },
  { value: "lg", label: "بزرگ" },
  { value: "xl", label: "خیلی بزرگ" },
];

const positionOptions = [
  { value: "top-right", label: "بالا × راست" },
  { value: "top-center", label: "بالا × وسط" },
  { value: "top-left", label: "بالا × چپ" },
  { value: "center-right", label: "وسط × راست" },
  { value: "center-center", label: "وسط × وسط" },
  { value: "center-left", label: "وسط × چپ" },
  { value: "bottom-right", label: "پایین × راست" },
  { value: "bottom-center", label: "پایین × وسط (پیش‌فرض)" },
  { value: "bottom-left", label: "پایین × چپ" },
];

export default async function HeroTextsPage() {
  const texts = await prisma.heroText.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-2">متن‌های چرخشی صفحه اول</h1>
      <p className="text-white/40 text-sm mb-8">
        هر متن می‌تواند اندازه، موقعیت روی تصویر، و نمایش در موبایل/دسکتاپ جدا داشته باشد. برای چند‌سطری کردن متن، داخل کادر متن کلید Enter را بزنید.
      </p>

      <div className="flex flex-col gap-3 mb-10">
        {texts.map((t: any) => (
          <details key={t.id} className="bg-white/5 border border-white/10 rounded-lg group">
            <summary className="flex items-center gap-3 p-3 cursor-pointer list-none flex-wrap">
              <span className="text-xs bg-white/10 px-2 py-1 rounded shrink-0">{t.lang.toUpperCase()}</span>
              <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded shrink-0">
                {deviceLabel[t.device] || t.device}
              </span>
              <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded shrink-0">
                {fontSizeOptions.find((f) => f.value === t.fontSize)?.label || t.fontSize}
              </span>
              <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-1 rounded shrink-0">
                {positionOptions.find((p) => p.value === t.position)?.label || t.position}
              </span>
              <p
                className={`flex-1 text-sm min-w-32 truncate ${t.lang === "fa" ? "" : "text-left"}`}
                dir={t.lang === "fa" ? "rtl" : "ltr"}
              >
                {t.content.split("\n")[0]}
                {t.content.includes("\n") ? " …" : ""}
              </p>
              <form action={toggleText.bind(null, t.id, !t.active)}>
                <button
                  type="submit"
                  className={`text-xs px-2 py-1 rounded ${t.active ? "bg-green-500/20 text-green-400" : "bg-white/10 text-white/40"}`}
                >
                  {t.active ? "فعال" : "غیرفعال"}
                </button>
              </form>
              <form action={deleteText.bind(null, t.id)}>
                <button type="submit" className="text-xs text-red-400">حذف</button>
              </form>
            </summary>

            <form action={updateText.bind(null, t.id)} className="flex flex-col gap-3 p-4 border-t border-white/10">
              <textarea
                name="content"
                required
                rows={3}
                defaultValue={t.content}
                dir={t.lang === "fa" ? "rtl" : "ltr"}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-white/40 resize-none"
              />
              <div className="flex gap-4 flex-wrap">
                <label className="flex items-center gap-2 text-sm">
                  <input type="radio" name="lang" value="fa" defaultChecked={t.lang === "fa"} /> فارسی
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="radio" name="lang" value="en" defaultChecked={t.lang === "en"} /> English
                </label>
              </div>
              <div className="flex gap-4 flex-wrap">
                <label className="flex items-center gap-2 text-sm">
                  <input type="radio" name="device" value="all" defaultChecked={t.device === "all"} /> هر دو نسخه
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="radio" name="device" value="mobile" defaultChecked={t.device === "mobile"} /> فقط موبایل
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="radio" name="device" value="desktop" defaultChecked={t.device === "desktop"} /> فقط دسکتاپ
                </label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col gap-1 text-sm">
                  <span className="text-white/60">اندازه متن</span>
                  <select name="fontSize" defaultValue={t.fontSize} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-white/40">
                    {fontSizeOptions.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-1 text-sm">
                  <span className="text-white/60">موقعیت روی تصویر</span>
                  <select name="position" defaultValue={t.position} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-white/40">
                    {positionOptions.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </label>
              </div>
              <button className="self-start px-5 py-2 rounded-full bg-white text-black text-sm font-medium">
                ذخیره تغییرات
              </button>
            </form>
          </details>
        ))}
        {texts.length === 0 && <p className="text-white/40 text-sm">هنوز متنی اضافه نشده.</p>}
      </div>

      <h2 className="text-lg font-bold mb-4">افزودن متن جدید</h2>
      <form action={addText} className="flex flex-col gap-3 bg-white/5 border border-white/10 rounded-lg p-4">
        <textarea
          name="content"
          required
          rows={3}
          placeholder={"متن جدید — برای چند‌سطری کردن، Enter بزنید"}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-white/40 resize-none"
        />
        <div className="flex gap-4 flex-wrap">
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" name="lang" value="fa" defaultChecked /> فارسی
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" name="lang" value="en" /> English
          </label>
        </div>
        <div className="flex gap-4 flex-wrap">
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" name="device" value="all" defaultChecked /> هر دو نسخه
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" name="device" value="mobile" /> فقط موبایل
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" name="device" value="desktop" /> فقط دسکتاپ
          </label>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-white/60">اندازه متن</span>
            <select name="fontSize" defaultValue="lg" className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-white/40">
              {fontSizeOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-white/60">موقعیت روی تصویر</span>
            <select name="position" defaultValue="bottom-center" className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-white/40">
              {positionOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </label>
        </div>
        <button className="self-start px-5 py-2 rounded-full bg-white text-black text-sm font-medium">
          افزودن
        </button>
      </form>
    </div>
  );
}
