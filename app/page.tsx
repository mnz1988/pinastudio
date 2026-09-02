import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { getDir } from "@/lib/text-direction";
import HeroLoopText, { HeroTextItem } from "@/components/HeroLoopText";

const defaults = {
  home_hero_image_desktop: "/hero-landscape.svg",
  home_hero_image_mobile: "/hero-portrait.svg",
  home_cta_text_desktop: "Click to view about me",
  home_cta_text_mobile: "Tap to view about me",
  home_cta_link_desktop: "/about",
  home_cta_link_mobile: "/about",
};

async function getHomeData() {
  const settings = await getSettings(Object.keys(defaults), defaults);

  let heroTexts: (HeroTextItem & { device: string })[] = [];
  try {
    const rows = await prisma.heroText.findMany({ where: { active: true }, orderBy: { order: "asc" } });
    if (rows.length)
      heroTexts = rows.map((r: any) => ({
        content: r.content,
        lang: r.lang,
        device: r.device,
        fontSize: r.fontSize,
        position: r.position,
      }));
  } catch {}

  if (heroTexts.length === 0) {
    heroTexts = [
      { content: "Designer & Developer", lang: "en", device: "all", fontSize: "lg", position: "bottom-center" },
    ];
  }

  return { settings, heroTexts };
}

export default async function HomePage() {
  const { settings, heroTexts } = await getHomeData();

  const desktopTexts = heroTexts.filter((t) => t.device === "all" || t.device === "desktop");
  const mobileTexts = heroTexts.filter((t) => t.device === "all" || t.device === "mobile");

  return (
    <div className="relative w-full h-dvh overflow-hidden">
      {/* Mobile hero — fully independent from desktop */}
      <Link href={settings.home_cta_link_mobile} className="md:hidden block relative w-full h-full group">
        <div
          className="absolute inset-0 bg-cover bg-center grayscale contrast-110 transition-transform duration-700 group-active:scale-105"
          style={{ backgroundImage: `url(${settings.home_hero_image_mobile})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />
        <HeroLoopText items={mobileTexts} />
        <span
          dir={getDir(settings.home_cta_text_mobile)}
          className="absolute bottom-8 inset-x-6 z-10 text-center text-xs text-white/60 tracking-widest"
        >
          {settings.home_cta_text_mobile}
        </span>
      </Link>

      {/* Desktop / tablet hero — fully independent from mobile */}
      <Link href={settings.home_cta_link_desktop} className="hidden md:block relative w-full h-full group">
        <div
          className="absolute inset-0 bg-cover bg-center grayscale contrast-110 transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url(${settings.home_hero_image_desktop})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />
        <HeroLoopText items={desktopTexts} />
        <span
          dir={getDir(settings.home_cta_text_desktop)}
          className="absolute bottom-8 inset-x-16 z-10 text-center text-sm text-white/60 tracking-widest"
        >
          {settings.home_cta_text_desktop}
        </span>
      </Link>
    </div>
  );
}
