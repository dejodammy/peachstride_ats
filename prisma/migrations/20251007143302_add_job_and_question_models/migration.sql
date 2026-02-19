-- CreateTable
CREATE TABLE "Job" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "jobType" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "requirements" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Question" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "question" TEXT NOT NULL,
    "options" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "jobId" INTEGER NOT NULL,
    CONSTRAINT "Question_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

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
    "nbcAssessmentDate" DATETIME,
    "nbcPassed" BOOLEAN,
    "interviewDate" DATETIME,
    "interviewLink" TEXT,
    "interviewPassed" BOOLEAN,
    "interviewComment" TEXT,
    "trainingDate" DATETIME,
    "trainingLocation" TEXT,
    "trainingPassed" BOOLEAN,
    "trainingComment" TEXT,
    "stage" TEXT DEFAULT 'Applied',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "jobId" INTEGER,
    CONSTRAINT "Applicant_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Applicant" ("address", "age", "createdAt", "cv", "email", "firstName", "gender", "id", "interviewComment", "interviewDate", "interviewLink", "interviewPassed", "lastName", "nbcAssessmentDate", "nbcPassed", "nysc", "passed", "phone", "score", "stage", "state", "trainingComment", "trainingDate", "trainingLocation", "trainingPassed") SELECT "address", "age", "createdAt", "cv", "email", "firstName", "gender", "id", "interviewComment", "interviewDate", "interviewLink", "interviewPassed", "lastName", "nbcAssessmentDate", "nbcPassed", "nysc", "passed", "phone", "score", "stage", "state", "trainingComment", "trainingDate", "trainingLocation", "trainingPassed" FROM "Applicant";
DROP TABLE "Applicant";
ALTER TABLE "new_Applicant" RENAME TO "Applicant";
CREATE UNIQUE INDEX "Applicant_phone_key" ON "Applicant"("phone");
CREATE UNIQUE INDEX "Applicant_email_key" ON "Applicant"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
