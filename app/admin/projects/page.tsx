import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function deleteProject(formData: FormData) {
  "use server";
  const id = formData.get("id") as string;
  await prisma.project.delete({ where: { id } });
  revalidatePath("/admin/projects");
  revalidatePath("/portfolio");
}

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">پروژه‌ها</h1>
        <Link href="/admin/projects/new" className="px-4 py-2 rounded-full bg-white text-black text-sm font-medium">
          + پروژه جدید
        </Link>
      </div>
      <div className="flex flex-col gap-3">
        {projects.map((p: any) => (
          <div key={p.id} className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-4">
            <img src={p.coverImage} className="w-16 h-16 object-cover rounded-lg grayscale" />
            <div className="flex-1">
              <p className="font-medium">{p.title}</p>
              <p className="text-white/40 text-xs">{p.slug}</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${p.published ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
              {p.published ? "منتشر شده" : "پیش‌نویس"}
            </span>
            <Link href={`/admin/projects/${p.id}`} className="text-sm underline">
              ویرایش
            </Link>
            <form action={deleteProject}>
              <input type="hidden" name="id" value={p.id} />
              <button className="text-sm text-red-400">حذف</button>
            </form>
          </div>
        ))}
        {projects.length === 0 && <p className="text-white/40">پروژه‌ای وجود ندارد.</p>}
      </div>
    </div>
  );
}
