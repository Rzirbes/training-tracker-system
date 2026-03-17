/*
  Warnings:

  - A unique constraint covering the columns `[finish_training_id]` on the table `schedule_workouts` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "schedule_workouts" ADD COLUMN     "finish_training_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "schedule_workouts_finish_training_id_key" ON "schedule_workouts"("finish_training_id");

-- AddForeignKey
ALTER TABLE "schedule_workouts" ADD CONSTRAINT "schedule_workouts_finish_training_id_fkey" FOREIGN KEY ("finish_training_id") REFERENCES "trainings"("id") ON DELETE SET NULL ON UPDATE CASCADE;
