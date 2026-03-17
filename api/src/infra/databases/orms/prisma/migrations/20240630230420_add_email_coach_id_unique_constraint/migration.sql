/*
  Warnings:

  - A unique constraint covering the columns `[email,coach_id]` on the table `athletes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "athletes_email_coach_id_key" ON "athletes"("email", "coach_id");
