/*
  Warnings:

  - You are about to drop the `File` table. If the table is not empty, all the data it contains will be lost.
  - The primary key for the `Applicant` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `firstName` on the `Applicant` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Applicant` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `Applicant` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - Added the required column `name` to the `Applicant` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "File";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Applicant" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
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
INSERT INTO "new_Applicant" ("address", "age", "createdAt", "email", "gender", "id", "phone", "state") SELECT "address", "age", "createdAt", "email", "gender", "id", "phone", "state" FROM "Applicant";
DROP TABLE "Applicant";
ALTER TABLE "new_Applicant" RENAME TO "Applicant";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
