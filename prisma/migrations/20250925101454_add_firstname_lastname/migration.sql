/*
  Warnings:

  - You are about to drop the column `name` on the `Applicant` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `Applicant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Applicant` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Applicant" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "gender" TEXT,
    "address" TEXT,
    "state" TEXT,
    "age" INTEGER,
    "cv" TEXT,
    "nysc" TEXT,
    "score" INTEGER,
    "passed" BOOLEAN,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Applicant" ("address", "age", "createdAt", "cv", "email", "gender", "id", "nysc", "passed", "phone", "score", "state") SELECT "address", "age", "createdAt", "cv", "email", "gender", "id", "nysc", "passed", "phone", "score", "state" FROM "Applicant";
DROP TABLE "Applicant";
ALTER TABLE "new_Applicant" RENAME TO "Applicant";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
