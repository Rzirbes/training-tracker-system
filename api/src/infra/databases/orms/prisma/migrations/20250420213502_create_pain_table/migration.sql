-- CreateTable
CREATE TABLE "pains" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "intensity" INTEGER NOT NULL,
    "body_region" VARCHAR(255) NOT NULL,
    "body_side" "BodySide" NOT NULL,
    "occurred_during" "InjuryContext" NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "athleteId" INTEGER NOT NULL,
    "trainingId" INTEGER,

    CONSTRAINT "pains_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pains_uuid_key" ON "pains"("uuid");

-- AddForeignKey
ALTER TABLE "pains" ADD CONSTRAINT "pains_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "athletes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pains" ADD CONSTRAINT "pains_trainingId_fkey" FOREIGN KEY ("trainingId") REFERENCES "trainings"("id") ON DELETE SET NULL ON UPDATE CASCADE;
