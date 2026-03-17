/*
  Warnings:

  - A unique constraint covering the columns `[athleteId,week]` on the table `weeklys_monitoring` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "weeklys_monitoring_week_key";

-- CreateIndex
CREATE UNIQUE INDEX "weeklys_monitoring_athleteId_week_key" ON "weeklys_monitoring"("athleteId", "week");
