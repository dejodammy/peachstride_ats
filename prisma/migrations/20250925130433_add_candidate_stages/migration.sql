-- AlterTable
ALTER TABLE "Applicant" ADD COLUMN "interviewDate" DATETIME;
ALTER TABLE "Applicant" ADD COLUMN "interviewLink" TEXT;
ALTER TABLE "Applicant" ADD COLUMN "nbcAssessmentDate" DATETIME;
ALTER TABLE "Applicant" ADD COLUMN "nbcPassed" BOOLEAN;
ALTER TABLE "Applicant" ADD COLUMN "stage" TEXT DEFAULT 'Applied';
ALTER TABLE "Applicant" ADD COLUMN "trainingDate" DATETIME;
ALTER TABLE "Applicant" ADD COLUMN "trainingLocation" TEXT;
