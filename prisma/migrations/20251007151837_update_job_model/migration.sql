/*
  Warnings:

  - You are about to drop the column `jobType` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `Job` table. All the data in the column will be lost.
  - You are about to alter the column `requirements` on the `Job` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
  - Added the required column `department` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `posted` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Job" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "posted" TEXT NOT NULL,
    "requirements" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Job" ("createdAt", "id", "location", "requirements", "title") SELECT "createdAt", "id", "location", "requirements", "title" FROM "Job";
DROP TABLE "Job";
ALTER TABLE "new_Job" RENAME TO "Job";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
