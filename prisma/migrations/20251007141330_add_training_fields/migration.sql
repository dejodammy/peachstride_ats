/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `Applicant` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Applicant` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Applicant" ADD COLUMN "trainingComment" TEXT;
ALTER TABLE "Applicant" ADD COLUMN "trainingPassed" BOOLEAN;

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'candidate',
    "candidateId" INTEGER,
    CONSTRAINT "User_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Applicant" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Applicant_phone_key" ON "Applicant"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Applicant_email_key" ON "Applicant"("email");
