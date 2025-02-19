/*
  Warnings:

  - Added the required column `birthdate` to the `players` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameFather` to the `players` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameMather` to the `players` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cpf` to the `teams` table without a default value. This is not possible if the table is not empty.

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
    "birthdate" DATETIME NOT NULL,
    "nameMather" TEXT NOT NULL,
    "nameFather" TEXT NOT NULL,
    "teamId" TEXT,
    CONSTRAINT "players_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_players" ("address", "cpf", "id", "name", "rg", "teamId") SELECT "address", "cpf", "id", "name", "rg", "teamId" FROM "players";
DROP TABLE "players";
ALTER TABLE "new_players" RENAME TO "players";
CREATE TABLE "new_teams" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "couch" TEXT NOT NULL,
    "cpf" TEXT NOT NULL
);
INSERT INTO "new_teams" ("city", "couch", "id", "name") SELECT "city", "couch", "id", "name" FROM "teams";
DROP TABLE "teams";
ALTER TABLE "new_teams" RENAME TO "teams";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
