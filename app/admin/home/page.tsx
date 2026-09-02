import { getSettings, saveSettings } from "@/lib/settings";
import { revalidatePath } from "next/cache";

const defaults = {
  home_hero_image_desktop: "/hero-landscape.svg",
  home_hero_image_mobile: "/hero-portrait.svg",
  home_cta_text_desktop: "برای مشاهده درباره من کلیک کنید",
  home_cta_text_mobile: "برای مشاهده درباره من ضربه بزنید",
  home_cta_link_desktop: "/about",
  home_cta_link_mobile: "/about",
};

async function save(formData: FormData) {
  "use server";
  await saveSettings({
    home_hero_image_desktop: formData.get("home_hero_image_desktop") as string,
    home_hero_image_mobile: formData.get("home_hero_image_mobile") as string,
    home_cta_text_desktop: formData.get("home_cta_text_desktop") as string,
    home_cta_text_mobile: formData.get("home_cta_text_mobile") as string,
    home_cta_link_desktop: formData.get("home_cta_link_desktop") as string,
    home_cta_link_mobile: formData.get("home_cta_link_mobile") as string,
  });
  revalidatePath("/");
  revalidatePath("/admin/home");
}

export default async function AdminHomePage() {
  const s = await getSettings(Object.keys(defaults), defaults);

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-2">صفحه اول</h1>
      <p className="text-white/40 text-sm mb-8">
        تصویر، متن دکمه و لینک صفحه اول — برای نسخه موبایل و دسکتاپ کاملاً مجزا تنظیم می‌شوند. برای مدیریت متن‌های چرخشی روی تصویر به بخش «متن‌های صفحه اول» بروید.
      </p>

      <form action={save} className="grid md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-4 bg-white/5 border border-white/10 rounded-xl p-5">
          <h2 className="font-bold text-sm text-white/70 mb-1">📱 نسخه موبایل</h2>
          <Field name="home_hero_image_mobile" label="آدرس تصویر (عمودی)" dir="ltr" defaultValue={s.home_hero_image_mobile} required />
          <Field name="home_cta_text_mobile" label="متن زیر تصویر" defaultValue={s.home_cta_text_mobile} required />
          <Field name="home_cta_link_mobile" label="لینک مقصد با کلیک/ضربه" dir="ltr" defaultValue={s.home_cta_link_mobile} required />
        </div>

        <div className="flex flex-col gap-4 bg-white/5 border border-white/10 rounded-xl p-5">
          <h2 className="font-bold text-sm text-white/70 mb-1">🖥 نسخه دسکتاپ / تبلت</h2>
          <Field name="home_hero_image_desktop" label="آدرس تصویر (افقی)" dir="ltr" defaultValue={s.home_hero_image_desktop} required />
          <Field name="home_cta_text_desktop" label="متن زیر تصویر" defaultValue={s.home_cta_text_desktop} required />
          <Field name="home_cta_link_desktop" label="لینک مقصد با کلیک" dir="ltr" defaultValue={s.home_cta_link_desktop} required />
        </div>

        <button className="md:col-span-2 self-start px-6 py-3 rounded-full bg-white text-black font-medium">
          ذخیره تغییرات
        </button>
      </form>
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
