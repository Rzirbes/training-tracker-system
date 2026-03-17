-- CreateTable
CREATE TABLE "default_training_types" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "trainingTypeId" INTEGER NOT NULL,

    CONSTRAINT "default_training_types_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "default_training_types_uuid_key" ON "default_training_types"("uuid");

-- AddForeignKey
ALTER TABLE "default_training_types" ADD CONSTRAINT "default_training_types_trainingTypeId_fkey" FOREIGN KEY ("trainingTypeId") REFERENCES "training_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
