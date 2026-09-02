import { prisma } from "@/lib/prisma";

/**
 * Fetch a set of SiteSetting rows by key and return them merged with the
 * given defaults. Safe to call even before the DB is migrated/seeded —
 * falls back to defaults on any error.
 */
export async function getSettings<T extends Record<string, string>>(
  keys: string[],
  defaults: T
): Promise<T> {
  try {
    const rows = await prisma.siteSetting.findMany({ where: { key: { in: keys } } });
    const map: Record<string, string> = {};
    for (const row of rows) map[row.key] = row.value;
    return { ...defaults, ...map };
  } catch {
    return defaults;
  }
}

export async function saveSettings(entries: Record<string, string>) {
  for (const [key, value] of Object.entries(entries)) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }
}
