import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";

async function updateProject(id: string, formData: FormData) {
  "use server";
  await prisma.project.update({
    where: { id },
    data: {
      title: formData.get("title") as string,
      summary: formData.get("summary") as string,
      actionLabel: formData.get("actionLabel") as string,
      coverImage: formData.get("coverImage") as string,
      orientation: formData.get("orientation") as string,
      published: formData.get("published") === "on",
    },
  });
  revalidatePath("/admin/projects");
  revalidatePath("/portfolio");
}

async function addBlock(id: string, formData: FormData) {
  "use server";
  const count = await prisma.contentBlock.count({ where: { projectId: id } });
  await prisma.contentBlock.create({
    data: {
      projectId: id,
      type: formData.get("type") as string,
      content: formData.get("content") as string,
      order: count,
    },
  });
  revalidatePath(`/admin/projects/${id}`);
  revalidatePath("/portfolio");
}

async function deleteBlock(id: string, blockId: string) {
  "use server";
  await prisma.contentBlock.delete({ where: { id: blockId } });
  revalidatePath(`/admin/projects/${id}`);
}

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id },
    include: { blocks: { orderBy: { order: "asc" } } },
  });
  if (!project) notFound();

  const update = updateProject.bind(null, id);
  const add = addBlock.bind(null, id);

  return (
    <div className="max-w-2xl flex flex-col gap-12">
      <div>
        <h1 className="text-2xl font-bold mb-8">ویرایش پروژه</h1>
        <form action={update} className="flex flex-col gap-4">
          <Field name="title" label="عنوان" defaultValue={project.title} required />
          <Field name="coverImage" label="آدرس تصویر کاور" defaultValue={project.coverImage} dir="ltr" required />
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" name="orientation" value="horizontal" defaultChecked={project.orientation === "horizontal"} /> افقی
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" name="orientation" value="vertical" defaultChecked={project.orientation === "vertical"} /> عمودی
            </label>
          </div>
          <TextArea name="summary" label="خلاصه" defaultValue={project.summary} required />
          <Field name="actionLabel" label="متن دکمه اکشن" defaultValue={project.actionLabel} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="published" defaultChecked={project.published} /> منتشر شود
          </label>
          <button className="mt-2 self-start px-6 py-3 rounded-full bg-white text-black font-medium">
            ذخیره تغییرات
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">محتوای صفحه کامل پروژه</h2>
        <div className="flex flex-col gap-3 mb-6">
          {project.blocks.map((b: any) => (
            <div key={b.id} className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-lg p-3">
              <span className="text-xs bg-white/10 px-2 py-1 rounded shrink-0">{b.type === "image" ? "تصویر" : "متن"}</span>
              <p className="text-sm text-white/70 flex-1 truncate">{b.content}</p>
              <form action={deleteBlock.bind(null, id, b.id)}>
                <button className="text-xs text-red-400">حذف</button>
              </form>
            </div>
          ))}
          {project.blocks.length === 0 && <p className="text-white/40 text-sm">هنوز بلوکی اضافه نشده.</p>}
        </div>
        <form action={add} className="flex flex-col gap-3 bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" name="type" value="text" defaultChecked /> بلوک متنی
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="radio" name="type" value="image" /> بلوک تصویری
            </label>
          </div>
          <textarea
            name="content"
            required
            rows={3}
            placeholder="متن یا آدرس URL تصویر"
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-white/40 resize-none"
          />
          <button className="self-start px-5 py-2 rounded-full bg-white text-black text-sm font-medium">
            افزودن بلوک
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ name, label, required, dir, defaultValue }: { name: string; label: string; required?: boolean; dir?: string; defaultValue?: string }) {
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

function TextArea({ name, label, required, defaultValue }: { name: string; label: string; required?: boolean; defaultValue?: string }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-white/60">{label}</span>
      <textarea
        name={name}
        required={required}
        defaultValue={defaultValue}
        rows={4}
        className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-white/40 resize-none"
      />
    </label>
  );
}
