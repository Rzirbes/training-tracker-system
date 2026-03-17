/*
  Warnings:

  - You are about to drop the `schedules` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "schedules" DROP CONSTRAINT "schedules_athlete_id_fkey";

-- DropForeignKey
ALTER TABLE "schedules" DROP CONSTRAINT "schedules_coach_id_fkey";

-- DropForeignKey
ALTER TABLE "schedules" DROP CONSTRAINT "schedules_training_planning_id_fkey";

-- DropTable
DROP TABLE "schedules";

-- CreateTable
CREATE TABLE "schedule_workouts" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "athlete_id" INTEGER NOT NULL,
    "coach_id" INTEGER NOT NULL,
    "training_planning_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "schedule_workouts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "schedule_workouts_uuid_key" ON "schedule_workouts"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "schedule_workouts_training_planning_id_key" ON "schedule_workouts"("training_planning_id");

-- AddForeignKey
ALTER TABLE "schedule_workouts" ADD CONSTRAINT "schedule_workouts_athlete_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "athletes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule_workouts" ADD CONSTRAINT "schedule_workouts_coach_id_fkey" FOREIGN KEY ("coach_id") REFERENCES "coaches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule_workouts" ADD CONSTRAINT "schedule_workouts_training_planning_id_fkey" FOREIGN KEY ("training_planning_id") REFERENCES "training_plannings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
