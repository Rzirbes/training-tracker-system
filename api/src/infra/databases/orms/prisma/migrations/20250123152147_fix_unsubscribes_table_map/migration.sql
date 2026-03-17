/*
  Warnings:

  - You are about to drop the `Unsubscribes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Unsubscribes";

-- CreateTable
CREATE TABLE "unsubscribes" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "unsubscribes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "unsubscribes_uuid_key" ON "unsubscribes"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "unsubscribes_email_key" ON "unsubscribes"("email");
