/*
  Warnings:

  - You are about to drop the `power_plant_address` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "coaches" DROP CONSTRAINT "coaches_addressId_fkey";

-- DropForeignKey
ALTER TABLE "power_plant_address" DROP CONSTRAINT "power_plant_address_city_id_fkey";

-- DropForeignKey
ALTER TABLE "power_plant_address" DROP CONSTRAINT "power_plant_address_state_id_fkey";

-- AlterTable
ALTER TABLE "schedule_workouts" ADD COLUMN     "canceled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "confirmed" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "power_plant_address";

-- CreateTable
CREATE TABLE "address" (
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

    CONSTRAINT "address_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "address_uuid_key" ON "address"("uuid");

-- AddForeignKey
ALTER TABLE "coaches" ADD CONSTRAINT "coaches_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "address" ADD CONSTRAINT "address_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "address" ADD CONSTRAINT "address_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "states"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
