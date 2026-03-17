/*
  Warnings:

  - Added the required column `load` to the `trainings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "trainings" ADD COLUMN     "load" DOUBLE PRECISION NOT NULL;

-- CreateTable
CREATE TABLE "WeeklyMonitoring" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "week" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "weekLoad" DOUBLE PRECISION NOT NULL,
    "averageWeekLoad" DOUBLE PRECISION NOT NULL,
    "monotony" DOUBLE PRECISION NOT NULL,
    "chronic" DOUBLE PRECISION NOT NULL,
    "acute" DOUBLE PRECISION NOT NULL,
    "chronicAcute" DOUBLE PRECISION NOT NULL,
    "strain" DOUBLE PRECISION NOT NULL,
    "deviation" DOUBLE PRECISION NOT NULL,
    "athleteId" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeeklyMonitoring_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WeeklyMonitoring_uuid_key" ON "WeeklyMonitoring"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "WeeklyMonitoring_week_key" ON "WeeklyMonitoring"("week");

-- AddForeignKey
ALTER TABLE "WeeklyMonitoring" ADD CONSTRAINT "WeeklyMonitoring_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "athletes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
