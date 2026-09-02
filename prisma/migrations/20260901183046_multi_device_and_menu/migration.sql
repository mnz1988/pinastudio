-- CreateTable
CREATE TABLE "MenuItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "href" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_HeroText" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "lang" TEXT NOT NULL,
    "device" TEXT NOT NULL DEFAULT 'all',
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_HeroText" ("active", "content", "id", "lang", "order") SELECT "active", "content", "id", "lang", "order" FROM "HeroText";
DROP TABLE "HeroText";
ALTER TABLE "new_HeroText" RENAME TO "HeroText";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "MenuItem_href_key" ON "MenuItem"("href");
