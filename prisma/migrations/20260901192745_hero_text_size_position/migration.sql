-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_HeroText" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "lang" TEXT NOT NULL,
    "device" TEXT NOT NULL DEFAULT 'all',
    "fontSize" TEXT NOT NULL DEFAULT 'lg',
    "position" TEXT NOT NULL DEFAULT 'bottom-center',
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_HeroText" ("active", "content", "device", "id", "lang", "order") SELECT "active", "content", "device", "id", "lang", "order" FROM "HeroText";
DROP TABLE "HeroText";
ALTER TABLE "new_HeroText" RENAME TO "HeroText";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
