/*
  Warnings:

  - You are about to drop the column `nameMather` on the `players` table. All the data in the column will be lost.
  - Added the required column `nameMother` to the `players` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_players" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "rg" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "birthdate" TEXT NOT NULL,
    "nameMother" TEXT NOT NULL,
    "nameFather" TEXT NOT NULL,
    "teamId" TEXT,
    CONSTRAINT "players_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_players" ("address", "birthdate", "cpf", "id", "name", "nameFather", "rg", "teamId") SELECT "address", "birthdate", "cpf", "id", "name", "nameFather", "rg", "teamId" FROM "players";
DROP TABLE "players";
ALTER TABLE "new_players" RENAME TO "players";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
