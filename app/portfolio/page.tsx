import { prisma } from "@/lib/prisma";
import PortfolioGrid from "@/components/PortfolioGrid";

async function getProjects() {
  try {
    return await prisma.project.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
  } catch {
    return [];
  }
}

export default async function PortfolioPage() {
  const projects = await getProjects();

  return (
    <div className="min-h-dvh pt-32 pb-24 px-6 md:px-16">
      <h1 className="text-3xl md:text-5xl font-bold mb-10">Portfolio</h1>
      {projects.length === 0 ? (
        <p className="text-white/50">No projects yet — add some from the admin panel.</p>
      ) : (
        <PortfolioGrid
          items={projects.map((p: any) => ({
            id: p.id,
            slug: p.slug,
            title: p.title,
            summary: p.summary,
            actionLabel: p.actionLabel,
            coverImage: p.coverImage,
            orientation: p.orientation,
          }))}
        />
      )}
    </div>
  );
}
