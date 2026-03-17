-- CreateTable
CREATE TABLE "schedules" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "athlete_id" INTEGER NOT NULL,
    "coach_id" INTEGER NOT NULL,
    "training_planning_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "schedules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "schedules_uuid_key" ON "schedules"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "schedules_training_planning_id_key" ON "schedules"("training_planning_id");

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_athlete_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "athletes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_coach_id_fkey" FOREIGN KEY ("coach_id") REFERENCES "coaches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_training_planning_id_fkey" FOREIGN KEY ("training_planning_id") REFERENCES "training_plannings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
