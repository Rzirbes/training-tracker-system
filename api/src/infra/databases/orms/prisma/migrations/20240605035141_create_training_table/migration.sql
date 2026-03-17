-- CreateTable
CREATE TABLE "trainings" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "athleteId" INTEGER NOT NULL,
    "trainingTypeId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "duration" DOUBLE PRECISION NOT NULL,
    "pse" DOUBLE PRECISION NOT NULL,
    "psr" DOUBLE PRECISION NOT NULL,
    "description" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trainings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "trainings_uuid_key" ON "trainings"("uuid");

-- AddForeignKey
ALTER TABLE "trainings" ADD CONSTRAINT "trainings_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "athletes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trainings" ADD CONSTRAINT "trainings_trainingTypeId_fkey" FOREIGN KEY ("trainingTypeId") REFERENCES "training-types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
