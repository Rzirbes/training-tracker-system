-- CreateTable
CREATE TABLE "absence_schedules" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "description" VARCHAR(255),
    "coach_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "absence_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "absence_schedules_uuid_key" ON "absence_schedules"("uuid");

-- AddForeignKey
ALTER TABLE "absence_schedules" ADD CONSTRAINT "absence_schedules_coach_id_fkey" FOREIGN KEY ("coach_id") REFERENCES "coaches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
