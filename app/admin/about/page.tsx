import { prisma } from "@/lib/prisma";
import { getSettings, saveSettings } from "@/lib/settings";
import { getDir } from "@/lib/text-direction";
import { revalidatePath } from "next/cache";

const heroDefaults = {
  about_hero_image_desktop: "/hero-landscape.svg",
  about_hero_image_mobile: "/hero-portrait.svg",
  about_hero_title: "درباره من",
  about_hero_subtitle: "زندگی و آثار",
};

async function saveHero(formData: FormData) {
  "use server";
  await saveSettings({
    about_hero_image_desktop: formData.get("about_hero_image_desktop") as string,
    about_hero_image_mobile: formData.get("about_hero_image_mobile") as string,
    about_hero_title: formData.get("about_hero_title") as string,
    about_hero_subtitle: formData.get("about_hero_subtitle") as string,
  });
  revalidatePath("/about");
  revalidatePath("/admin/about");
}

async function addBlock(formData: FormData) {
  "use server";
  const count = await prisma.aboutBlock.count();
  await prisma.aboutBlock.create({
    data: {
      type: formData.get("type") as string,
      content: formData.get("content") as string,
      order: count,
    },
  });
  revalidatePath("/about");
  revalidatePath("/admin/about");
}

async function deleteBlock(id: string) {
  "use server";
  await prisma.aboutBlock.delete({ where: { id } });
  revalidatePath("/about");
  revalidatePath("/admin/about");
}

async function moveBlock(id: string, direction: "up" | "down") {
  "use server";
  const blocks = await prisma.aboutBlock.findMany({ orderBy: { order: "asc" } });
  const index = blocks.findIndex((b: any) => b.id === id);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapWith < 0 || swapWith >= blocks.length) return;

  await prisma.$transaction([
    prisma.aboutBlock.update({ where: { id: blocks[index].id }, data: { order: blocks[swapWith].order } }),
    prisma.aboutBlock.update({ where: { id: blocks[swapWith].id }, data: { order: blocks[index].order } }),
  ]);
  revalidatePath("/about");
  revalidatePath("/admin/about");
}

const typeLabel: Record<string, string> = {
  text: "متن",
  image: "تصویر تکی",
  gallery: "ردیف چند تصویر",
};

export default async function AdminAboutPage() {
  const [settings, blocks] = await Promise.all([
    getSettings(Object.keys(heroDefaults), heroDefaults),
    prisma.aboutBlock.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <div className="max-w-2xl flex flex-col gap-14">
      <div>
        <h1 className="text-2xl font-bold mb-2">صفحه درباره من</h1>
        <p className="text-white/40 text-sm mb-8">
          تصویر هیرو برای موبایل و دسکتاپ کاملاً مجزاست — هرکدام را جدا آپلود کنید تا در هر دستگاه بهترین نمایش را داشته باشد.
        </p>
        <form action={saveHero} className="flex flex-col gap-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4 bg-white/5 border border-white/10 rounded-xl p-5">
              <h2 className="font-bold text-sm text-white/70 mb-1">📱 تصویر هیرو موبایل (عمودی)</h2>
              <Field name="about_hero_image_mobile" label="آدرس تصویر" dir="ltr" defaultValue={settings.about_hero_image_mobile} required />
            </div>
            <div className="flex flex-col gap-4 bg-white/5 border border-white/10 rounded-xl p-5">
              <h2 className="font-bold text-sm text-white/70 mb-1">🖥 تصویر هیرو دسکتاپ (افقی)</h2>
              <Field name="about_hero_image_desktop" label="آدرس تصویر" dir="ltr" defaultValue={settings.about_hero_image_desktop} required />
            </div>
          </div>
          <Field name="about_hero_title" label="عنوان بزرگ (مشترک بین هر دو نسخه)" defaultValue={settings.about_hero_title} required />
          <Field name="about_hero_subtitle" label="زیرعنوان (مشترک بین هر دو نسخه)" defaultValue={settings.about_hero_subtitle} required />
          <button className="self-start px-6 py-3 rounded-full bg-white text-black font-medium">
            ذخیره هیرو
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-2">محتوای زیر هیرو</h2>
        <p className="text-white/40 text-sm mb-6">
          بلوک‌های متن، تصویر تکی، یا ردیف چند تصویر را به ترتیب دلخواه اضافه کنید — دقیقاً به همان ترتیب در صفحه نمایش داده می‌شوند.
        </p>
        <div className="flex flex-col gap-3 mb-6">
          {blocks.map((b: any, i: number) => (
            <div key={b.id} className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-lg p-3">
              <span className="text-xs bg-white/10 px-2 py-1 rounded shrink-0">{typeLabel[b.type] || b.type}</span>
              <p className="text-sm text-white/70 flex-1 truncate" dir={b.type === "text" ? getDir(b.content) : "ltr"}>
                {b.content}
              </p>
              <div className="flex items-center gap-1 shrink-0">
                <form action={moveBlock.bind(null, b.id, "up")}>
                  <button disabled={i === 0} className="text-xs px-2 py-1 rounded hover:bg-white/10 disabled:opacity-20">▲</button>
                </form>
                <form action={moveBlock.bind(null, b.id, "down")}>
                  <button disabled={i === blocks.length - 1} className="text-xs px-2 py-1 rounded hover:bg-white/10 disabled:opacity-20">▼</button>
                </form>
                <form action={deleteBlock.bind(null, b.id)}>
                  <button className="text-xs text-red-400 px-2 py-1">حذف</button>
                </form>
              </div>
            </div>
          ))}
          {blocks.length === 0 && <p className="text-white/40 text-sm">هنوز بلوکی اضافه نشده.</p>}
        </div>

        <form action={addBlock} className="flex flex-col gap-3 bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="flex gap-4 flex-wrap">
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" name="type" value="text" defaultChecked /> متن
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" name="type" value="image" /> تصویر تکی
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" name="type" value="gallery" /> ردیف چند تصویر
            </label>
          </div>
          <textarea
            name="content"
            required
            rows={3}
            placeholder="متن، آدرس URL تصویر، یا چند آدرس URL جدا شده با ویرگول (برای ردیف تصاویر)"
            dir="ltr"
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-white/40 resize-none text-left"
          />
          <button className="self-start px-5 py-2 rounded-full bg-white text-black text-sm font-medium">
            افزودن بلوک
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({
  name,
  label,
  required,
  dir,
  defaultValue,
}: {
  name: string;
  label: string;
  required?: boolean;
  dir?: string;
  defaultValue?: string;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-white/60">{label}</span>
      <input
        name={name}
        required={required}
        dir={dir as any}
        defaultValue={defaultValue}
        className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-white/40"
      />
    </label>
  );
}
