import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

function slugify(str: string) {
  return str
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u0600-\u06FF-]/g, "");
}

async function createProject(formData: FormData) {
  "use server";
  const title = formData.get("title") as string;
  const project = await prisma.project.create({
    data: {
      title,
      slug: slugify(title) + "-" + Date.now().toString(36),
      summary: formData.get("summary") as string,
      actionLabel: (formData.get("actionLabel") as string) || "مشاهده کامل",
      coverImage: formData.get("coverImage") as string,
      orientation: (formData.get("orientation") as string) || "horizontal",
      published: formData.get("published") === "on",
    },
  });
  revalidatePath("/admin/projects");
  revalidatePath("/portfolio");
  redirect(`/admin/projects/${project.id}`);
}

export default function NewProjectPage() {
  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-8">پروژه جدید</h1>
      <form action={createProject} className="flex flex-col gap-4">
        <Field name="title" label="عنوان" required />
        <Field name="coverImage" label="آدرس تصویر کاور (URL)" required dir="ltr" />
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" name="orientation" value="horizontal" defaultChecked /> افقی
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" name="orientation" value="vertical" /> عمودی
          </label>
        </div>
        <TextArea name="summary" label="خلاصه (نمایش در پاپ‌آپ)" required />
        <Field name="actionLabel" label="متن دکمه اکشن" />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="published" defaultChecked /> منتشر شود
        </label>
        <button className="mt-2 self-start px-6 py-3 rounded-full bg-white text-black font-medium">
          ایجاد پروژه
        </button>
      </form>
    </div>
  );
}

function Field({ name, label, required, dir }: { name: string; label: string; required?: boolean; dir?: string }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-white/60">{label}</span>
      <input
        name={name}
        required={required}
        dir={dir as any}
        className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-white/40"
      />
    </label>
  );
}

function TextArea({ name, label, required }: { name: string; label: string; required?: boolean }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-white/60">{label}</span>
      <textarea
        name={name}
        required={required}
        rows={4}
        className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-white/40 resize-none"
      />
    </label>
  );
}
