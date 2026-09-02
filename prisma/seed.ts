import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@example.com";
  const password = process.env.ADMIN_PASSWORD || "change-me-please";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (!existing) {
    await prisma.user.create({
      data: {
        email,
        name: "Admin",
        role: "ADMIN",
        passwordHash: await bcrypt.hash(password, 10),
      },
    });
    console.log(`Admin created: ${email} / ${password}`);
  } else {
    console.log("Admin already exists, skipping.");
  }

  const heroCount = await prisma.heroText.count();
  if (heroCount === 0) {
    await prisma.heroText.createMany({
      data: [
        { content: "Designer & Developer", lang: "en", order: 0 },
        { content: "Building things that matter", lang: "en", order: 1 },
      ],
    });
  }

  const siteSettings: [string, string][] = [
    ["site_title", "Portfolio"],
    ["site_description", "Portfolio & personal website"],
    ["site_favicon", "/favicon.ico"],
    ["site_transition_logo", "/logo.svg"],
  ];
  for (const [key, value] of siteSettings) {
    await prisma.siteSetting.upsert({ where: { key }, update: {}, create: { key, value } });
  }

  const aboutSettings: [string, string][] = [
    ["about_hero_image_mobile", "/hero-portrait.svg"],
    ["about_hero_image_desktop", "/hero-landscape.svg"],
    ["about_hero_title", "About Me"],
    ["about_hero_subtitle", "Life and Work"],
  ];
  for (const [key, value] of aboutSettings) {
    await prisma.siteSetting.upsert({ where: { key }, update: {}, create: { key, value } });
  }

  const aboutBlockCount = await prisma.aboutBlock.count();
  if (aboutBlockCount === 0) {
    await prisma.aboutBlock.create({
      data: {
        type: "text",
        content:
          "Hi! This is the About page. From the admin panel (/admin/about) you can edit the hero image, titles, and text/image blocks on this page.",
        order: 0,
      },
    });
  }

  const menuDefaults: { href: string; label: string; order: number }[] = [
    { href: "/", label: "Home", order: 0 },
    { href: "/about", label: "About", order: 1 },
    { href: "/portfolio", label: "Portfolio", order: 2 },
    { href: "/contact", label: "Contact", order: 3 },
  ];
  for (const item of menuDefaults) {
    await prisma.menuItem.upsert({
      where: { href: item.href },
      update: {},
      create: item,
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
