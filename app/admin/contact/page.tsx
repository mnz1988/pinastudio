import { getSettings, saveSettings } from "@/lib/settings";
import { revalidatePath } from "next/cache";

const defaults = {
  contact_title: "ارتباط با من",
  contact_description: "برای سفارش پروژه، همکاری یا هر سوالی، فرم زیر را پر کنید.",
  contact_label_name: "نام شما",
  contact_label_email: "ایمیل",
  contact_label_message: "پیام شما",
  contact_button_text: "ارسال پیام",
  contact_button_sending_text: "در حال ارسال...",
  contact_success_message: "پیام شما با موفقیت ارسال شد.",
  contact_error_message: "مشکلی پیش آمد، دوباره تلاش کنید.",
};

async function save(formData: FormData) {
  "use server";
  const entries: Record<string, string> = {};
  for (const key of Object.keys(defaults)) {
    entries[key] = formData.get(key) as string;
  }
  await saveSettings(entries);
  revalidatePath("/contact");
  revalidatePath("/admin/contact");
}

export default async function AdminContactPage() {
  const s = await getSettings(Object.keys(defaults), defaults);

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-2">صفحه ارتباط با من</h1>
      <p className="text-white/40 text-sm mb-8">تمام متن‌ها و لیبل‌های فرم تماس از اینجا قابل ویرایش است.</p>
      <form action={save} className="flex flex-col gap-4">
        <Field name="contact_title" label="عنوان صفحه" defaultValue={s.contact_title} required />
        <TextArea name="contact_description" label="توضیح زیر عنوان" defaultValue={s.contact_description} required />

        <div className="h-px bg-white/10 my-2" />

        <Field name="contact_label_name" label="لیبل فیلد نام" defaultValue={s.contact_label_name} required />
        <Field name="contact_label_email" label="لیبل فیلد ایمیل" defaultValue={s.contact_label_email} required />
        <Field name="contact_label_message" label="لیبل فیلد پیام" defaultValue={s.contact_label_message} required />

        <div className="h-px bg-white/10 my-2" />

        <Field name="contact_button_text" label="متن دکمه ارسال" defaultValue={s.contact_button_text} required />
        <Field name="contact_button_sending_text" label="متن دکمه هنگام ارسال" defaultValue={s.contact_button_sending_text} required />
        <Field name="contact_success_message" label="پیام موفقیت" defaultValue={s.contact_success_message} required />
        <Field name="contact_error_message" label="پیام خطا" defaultValue={s.contact_error_message} required />

        <button className="mt-2 self-start px-6 py-3 rounded-full bg-white text-black font-medium">
          ذخیره
        </button>
      </form>
    </div>
  );
}

function Field({
  name,
  label,
  required,
  defaultValue,
}: {
  name: string;
  label: string;
  required?: boolean;
  defaultValue?: string;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-white/60">{label}</span>
      <input
        name={name}
        required={required}
        defaultValue={defaultValue}
        className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-white/40"
      />
    </label>
  );
}

function TextArea({
  name,
  label,
  required,
  defaultValue,
}: {
  name: string;
  label: string;
  required?: boolean;
  defaultValue?: string;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-white/60">{label}</span>
      <textarea
        name={name}
        required={required}
        defaultValue={defaultValue}
        rows={2}
        className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-white/40 resize-none"
      />
    </label>
  );
}
