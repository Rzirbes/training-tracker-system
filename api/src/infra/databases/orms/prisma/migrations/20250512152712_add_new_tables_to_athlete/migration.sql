/*
  Warnings:

  - A unique constraint covering the columns `[cpf]` on the table `athletes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[address_id]` on the table `athletes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "DominantFoot" AS ENUM ('RIGHT', 'LEFT', 'AMBIDEXTRO');

-- CreateEnum
CREATE TYPE "FootballPosition" AS ENUM ('GOALKEEPER', 'RIGHT_FULLBACK', 'LEFT_FULLBACK', 'RIGHT_WING_BACK', 'LEFT_WING_BACK', 'BACK', 'RIGHT_CENTER_BACK', 'LEFT_CENTER_BACK', 'SWEEPER', 'DEFENSIVE_MIDFIELDER', 'RIGHT_DEFENSIVE_MIDFIELDER', 'LEFT_DEFENSIVE_MIDFIELDER', 'CENTRAL_MIDFIELDER', 'RIGHT_CENTRAL_MIDFIELDER', 'LEFT_CENTRAL_MIDFIELDER', 'ATTACKING_MIDFIELDER', 'RIGHT_WINGER', 'LEFT_WINGER', 'SECOND_STRIKER', 'CENTER_FORWARD', 'STRIKER');

-- DropForeignKey
ALTER TABLE "address" DROP CONSTRAINT "address_city_id_fkey";

-- DropForeignKey
ALTER TABLE "address" DROP CONSTRAINT "address_state_id_fkey";

-- AlterTable
ALTER TABLE "address" ADD COLUMN     "country_id" INTEGER,
ALTER COLUMN "street" DROP NOT NULL,
ALTER COLUMN "neighborhood" DROP NOT NULL,
ALTER COLUMN "building_number" DROP NOT NULL,
ALTER COLUMN "zip_code" DROP NOT NULL,
ALTER COLUMN "city_id" DROP NOT NULL,
ALTER COLUMN "state_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "athletes" ADD COLUMN     "address_id" INTEGER,
ADD COLUMN     "avatar_url" VARCHAR(500),
ADD COLUMN     "best_skill" VARCHAR(255),
ADD COLUMN     "cpf" VARCHAR(11),
ADD COLUMN     "dominant_foot" "DominantFoot",
ADD COLUMN     "goal" VARCHAR(255),
ADD COLUMN     "observation" VARCHAR(255),
ADD COLUMN     "phone" VARCHAR(22),
ADD COLUMN     "position" "FootballPosition",
ADD COLUMN     "worst_skill" VARCHAR(255);

-- AlterTable
ALTER TABLE "states" ADD COLUMN     "country_id" INTEGER,
ALTER COLUMN "uf" DROP NOT NULL;

-- CreateTable
CREATE TABLE "athlete_photos" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "extension" TEXT NOT NULL,
    "athlete_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "athlete_photos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "countries" (
    "id" INTEGER NOT NULL,
    "uuid" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "code" VARCHAR(3),
    "is_enabled" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "countries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clubs" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "city_id" INTEGER,
    "state_id" INTEGER,
    "country_id" INTEGER,

    CONSTRAINT "clubs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "athletes_clubs" (
    "id" SERIAL NOT NULL,
    "uuid" UUID NOT NULL,
    "athleteId" INTEGER NOT NULL,
    "clubId" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "athletes_clubs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "countries_uuid_key" ON "countries"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "clubs_uuid_key" ON "clubs"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "athletes_clubs_uuid_key" ON "athletes_clubs"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "athletes_cpf_key" ON "athletes"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "athletes_address_id_key" ON "athletes"("address_id");

-- AddForeignKey
ALTER TABLE "athletes" ADD CONSTRAINT "athletes_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athlete_photos" ADD CONSTRAINT "athlete_photos_athlete_id_fkey" FOREIGN KEY ("athlete_id") REFERENCES "athletes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "states" ADD CONSTRAINT "states_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "address" ADD CONSTRAINT "address_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "address" ADD CONSTRAINT "address_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "states"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "address" ADD CONSTRAINT "address_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clubs" ADD CONSTRAINT "clubs_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clubs" ADD CONSTRAINT "clubs_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "states"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clubs" ADD CONSTRAINT "clubs_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athletes_clubs" ADD CONSTRAINT "athletes_clubs_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "athletes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athletes_clubs" ADD CONSTRAINT "athletes_clubs_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "clubs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
