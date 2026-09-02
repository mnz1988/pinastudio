import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getDir } from "@/lib/text-direction";

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({
    where: { slug },
    include: { blocks: { orderBy: { order: "asc" } } },
  });

  if (!project || !project.published) notFound();

  return (
    <div className="min-h-dvh pt-32 pb-24 px-6 md:px-16 max-w-3xl mx-auto flex flex-col gap-8">
      <h1 dir={getDir(project.title)} className="text-3xl md:text-5xl font-bold">
        {project.title}
      </h1>
      <div className="flex flex-col gap-8">
        {project.blocks.map((block: any) =>
          block.type === "image" ? (
            <img key={block.id} src={block.content} alt="" className="w-full rounded-2xl" />
          ) : (
            <p key={block.id} dir={getDir(block.content)} className="text-white/80 leading-8 whitespace-pre-line text-lg">
              {block.content}
            </p>
          )
        )}
      </div>
    </div>
  );
}

