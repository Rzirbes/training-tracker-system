/*
  Warnings:

  - You are about to drop the column `coach_id` on the `athletes` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `athletes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[addressId]` on the table `coaches` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `schedulerColor` to the `coaches` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "athletes" DROP CONSTRAINT "athletes_coach_id_fkey";

-- DropIndex
DROP INDEX "athletes_email_coach_id_key";

-- AlterTable
ALTER TABLE "athletes" DROP COLUMN "coach_id";

-- AlterTable
ALTER TABLE "coaches" ADD COLUMN     "addressId" INTEGER,
ADD COLUMN     "phone" VARCHAR(18),
ADD COLUMN     "role" VARCHAR(255),
ADD COLUMN     "schedulerColor" VARCHAR(255) NOT NULL;

-- CreateTable
CREATE TABLE "power_plant_address" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "street" VARCHAR(255) NOT NULL,
    "neighborhood" VARCHAR(255) NOT NULL,
    "building_number" VARCHAR(10) NOT NULL,
    "complement" VARCHAR(255),
    "zip_code" VARCHAR(10) NOT NULL,
    "city_id" INTEGER NOT NULL,
    "state_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "power_plant_address_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "power_plant_address_uuid_key" ON "power_plant_address"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "athletes_email_key" ON "athletes"("email");

-- CreateIndex
CREATE UNIQUE INDEX "coaches_addressId_key" ON "coaches"("addressId");

-- AddForeignKey
ALTER TABLE "coaches" ADD CONSTRAINT "coaches_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "power_plant_address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "power_plant_address" ADD CONSTRAINT "power_plant_address_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "power_plant_address" ADD CONSTRAINT "power_plant_address_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "states"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
