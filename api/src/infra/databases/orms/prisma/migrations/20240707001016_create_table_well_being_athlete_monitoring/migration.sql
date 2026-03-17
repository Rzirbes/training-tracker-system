/*
  Warnings:

  - You are about to drop the `WeeklyMonitoring` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `training-plannings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `training-types` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "WeeklyMonitoring" DROP CONSTRAINT "WeeklyMonitoring_athleteId_fkey";

-- DropForeignKey
ALTER TABLE "training-plannings" DROP CONSTRAINT "training-plannings_athleteId_fkey";

-- DropForeignKey
ALTER TABLE "training-plannings" DROP CONSTRAINT "training-plannings_trainingTypeId_fkey";

-- DropForeignKey
ALTER TABLE "training-types" DROP CONSTRAINT "training-types_coach_id_fkey";

-- DropForeignKey
ALTER TABLE "trainings" DROP CONSTRAINT "trainings_trainingTypeId_fkey";

-- DropTable
DROP TABLE "WeeklyMonitoring";

-- DropTable
DROP TABLE "training-plannings";

-- DropTable
DROP TABLE "training-types";

-- CreateTable
CREATE TABLE "training_types" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "coach_id" INTEGER NOT NULL,

    CONSTRAINT "training_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_plannings" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "athleteId" INTEGER NOT NULL,
    "trainingTypeId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "duration" DOUBLE PRECISION NOT NULL,
    "pse" DOUBLE PRECISION NOT NULL,
    "description" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "training_plannings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "weeklys_monitoring" (
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

    CONSTRAINT "weeklys_monitoring_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "well_being_monitoring" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "athleteId" INTEGER NOT NULL,
    "sleep" INTEGER NOT NULL,
    "disposition" INTEGER NOT NULL,
    "musclePain" INTEGER NOT NULL,
    "stress" INTEGER NOT NULL,
    "humor" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "well_being_monitoring_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "training_types_uuid_key" ON "training_types"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "training_plannings_uuid_key" ON "training_plannings"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "weeklys_monitoring_uuid_key" ON "weeklys_monitoring"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "weeklys_monitoring_week_key" ON "weeklys_monitoring"("week");

-- CreateIndex
CREATE UNIQUE INDEX "well_being_monitoring_uuid_key" ON "well_being_monitoring"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "well_being_monitoring_athleteId_date_key" ON "well_being_monitoring"("athleteId", "date");

-- AddForeignKey
ALTER TABLE "training_types" ADD CONSTRAINT "training_types_coach_id_fkey" FOREIGN KEY ("coach_id") REFERENCES "coaches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_plannings" ADD CONSTRAINT "training_plannings_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "athletes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_plannings" ADD CONSTRAINT "training_plannings_trainingTypeId_fkey" FOREIGN KEY ("trainingTypeId") REFERENCES "training_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trainings" ADD CONSTRAINT "trainings_trainingTypeId_fkey" FOREIGN KEY ("trainingTypeId") REFERENCES "training_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "weeklys_monitoring" ADD CONSTRAINT "weeklys_monitoring_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "athletes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "well_being_monitoring" ADD CONSTRAINT "well_being_monitoring_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "athletes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
