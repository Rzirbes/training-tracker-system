-- CreateEnum
CREATE TYPE "BodySide" AS ENUM ('BILATERAL', 'RIGHT', 'LEFT');

-- CreateEnum
CREATE TYPE "InjuryDegree" AS ENUM ('MICROTRAUMA', 'GRAU_I', 'GRAU_II', 'GRAU_III', 'TOTAL');

-- CreateEnum
CREATE TYPE "InjuryContext" AS ENUM ('GAME', 'TRAINING', 'ACADEMY', 'OUT_FIELD', 'OTHERS');

-- CreateTable
CREATE TABLE "injuries" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "type" VARCHAR(255) NOT NULL,
    "body_region" VARCHAR(255) NOT NULL,
    "body_side" "BodySide" NOT NULL,
    "degree" "InjuryDegree" NOT NULL,
    "occurred_during" "InjuryContext" NOT NULL,
    "description" TEXT,
    "diagnosis_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "exam_type" TEXT,
    "requires_surgery" BOOLEAN NOT NULL DEFAULT false,
    "surgery_date" TIMESTAMP(3),
    "treatment_type" VARCHAR(255),
    "returnDate_planned" TIMESTAMP(3),
    "returnDate_actual" TIMESTAMP(3),
    "minutes_first_game" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "athleteId" INTEGER NOT NULL,
    "trainingId" INTEGER,

    CONSTRAINT "injuries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "injuries_uuid_key" ON "injuries"("uuid");

-- AddForeignKey
ALTER TABLE "injuries" ADD CONSTRAINT "injuries_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "athletes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "injuries" ADD CONSTRAINT "injuries_trainingId_fkey" FOREIGN KEY ("trainingId") REFERENCES "trainings"("id") ON DELETE SET NULL ON UPDATE CASCADE;
