import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { getDir } from "@/lib/text-direction";

const heroDefaults = {
  about_hero_image_desktop: "/hero-landscape.svg",
  about_hero_image_mobile: "/hero-portrait.svg",
  about_hero_title: "About Me",
  about_hero_subtitle: "Life and Work",
};

async function getAboutData() {
  const settings = await getSettings(Object.keys(heroDefaults), heroDefaults);
  let blocks: any[] = [];
  try {
    blocks = await prisma.aboutBlock.findMany({ orderBy: { order: "asc" } });
  } catch {}
  return { settings, blocks };
}

export default async function AboutPage() {
  const { settings, blocks } = await getAboutData();

  return (
    <div>
      {/* Full-screen hero — separate background image per device */}
      <section className="relative w-full h-dvh overflow-hidden flex items-center justify-center">
        <div
          className="md:hidden absolute inset-0 bg-cover bg-center grayscale contrast-110"
          style={{ backgroundImage: `url(${settings.about_hero_image_mobile})` }}
        />
        <div
          className="hidden md:block absolute inset-0 bg-cover bg-center grayscale contrast-110"
          style={{ backgroundImage: `url(${settings.about_hero_image_desktop})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />

        <div className="relative z-10 text-center px-6 flex flex-col items-center gap-4">
          <h1 dir={getDir(settings.about_hero_title)} className="text-5xl md:text-7xl font-bold text-white tracking-tight">
            {settings.about_hero_title}
          </h1>
          <p dir={getDir(settings.about_hero_subtitle)} className="text-lg md:text-2xl text-white/80">
            {settings.about_hero_subtitle}
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-white/60 text-xs tracking-widest">Scroll</span>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeOpacity="0.7" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </section>

      {/* Body content */}
      <div className="max-w-3xl mx-auto px-6 md:px-0 py-20 flex flex-col gap-10">
        {blocks.length === 0 && (
          <p className="text-white/50 text-center">
            No content yet — add text and images from the admin panel (About page).
          </p>
        )}

        {blocks.map((b: any) => {
          if (b.type === "text") {
            return (
              <p key={b.id} dir={getDir(b.content)} className="text-white/80 leading-8 text-lg whitespace-pre-line">
                {b.content}
              </p>
            );
          }
          if (b.type === "image") {
            return <img key={b.id} src={b.content} alt="" className="w-full rounded-xl" />;
          }
          if (b.type === "gallery") {
            const urls = b.content.split(",").map((u: string) => u.trim()).filter(Boolean);
            return (
              <div key={b.id} className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {urls.map((url: string, i: number) => (
                  <img key={i} src={url} alt="" className="w-full aspect-[3/4] object-cover rounded-xl" />
                ))}
              </div>
            );
          }
          return null;
        })}

        <div className="pt-6 border-t border-white/10">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-lg font-medium hover:opacity-70 transition-opacity"
          >
            Contact Me →
          </Link>
        </div>
      </div>
    </div>
  );
}
