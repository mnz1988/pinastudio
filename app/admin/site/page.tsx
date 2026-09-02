import { getSettings, saveSettings } from "@/lib/settings";
import { revalidatePath } from "next/cache";

const defaults = {
  site_title: "پورتفولیو",
  site_description: "وبسایت معرفی و پورتفولیو",
  site_favicon: "/favicon.ico",
  site_transition_logo: "/logo.svg",
};

async function save(formData: FormData) {
  "use server";
  await saveSettings({
    site_title: formData.get("site_title") as string,
    site_description: formData.get("site_description") as string,
    site_favicon: formData.get("site_favicon") as string,
    site_transition_logo: formData.get("site_transition_logo") as string,
  });
  revalidatePath("/", "layout");
  revalidatePath("/admin/site");
}

export default async function AdminSitePage() {
  const s = await getSettings(Object.keys(defaults), defaults);

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-2">تنظیمات کلی سایت</h1>
      <p className="text-white/40 text-sm mb-8">
        عنوان تب مرورگر، آیکون کنار آن (فاوآیکون)، و لوگویی که در ترنزیشن بین صفحات پیکسلی می‌شود.
      </p>
      <form action={save} className="flex flex-col gap-4">
        <Field name="site_title" label="عنوان سایت (نمایش در تب مرورگر)" defaultValue={s.site_title} required />
        <Field name="site_description" label="توضیح کوتاه سایت (برای موتورهای جستجو)" defaultValue={s.site_description} />
        <Field
          name="site_favicon"
          label="آدرس فاوآیکون (URL تصویر مربعی کوچک، مثلاً .png یا .ico)"
          defaultValue={s.site_favicon}
          dir="ltr"
          required
        />
        {s.site_favicon && (
          <div className="flex items-center gap-3 text-sm text-white/50">
            پیش‌نمایش:
            <img src={s.site_favicon} alt="favicon preview" className="w-6 h-6 rounded bg-white/10" />
          </div>
        )}
        <Field
          name="site_transition_logo"
          label="آدرس لوگوی ترنزیشن بین صفحات (تصویر ساده و کنتراست بالا بهتر جواب می‌دهد)"
          defaultValue={s.site_transition_logo}
          dir="ltr"
          required
        />
        {s.site_transition_logo && (
          <div className="flex items-center gap-3 text-sm text-white/50">
            پیش‌نمایش:
            <img src={s.site_transition_logo} alt="transition logo preview" className="w-12 h-12 rounded bg-white/10" />
          </div>
        )}
        <button className="self-start px-6 py-3 rounded-full bg-white text-black font-medium">
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
