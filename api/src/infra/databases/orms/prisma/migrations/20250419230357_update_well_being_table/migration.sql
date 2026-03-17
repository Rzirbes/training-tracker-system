/*
  Warnings:

  - You are about to drop the column `disposition` on the `well_being_monitoring` table. All the data in the column will be lost.
  - You are about to drop the column `musclePain` on the `well_being_monitoring` table. All the data in the column will be lost.
  - Added the required column `energy` to the `well_being_monitoring` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fatigue` to the `well_being_monitoring` table without a default value. This is not possible if the table is not empty.
  - Added the required column `motivation` to the `well_being_monitoring` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nutrition` to the `well_being_monitoring` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pain` to the `well_being_monitoring` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sleep_hours` to the `well_being_monitoring` table without a default value. This is not possible if the table is not empty.
  - Added the required column `water_intake` to the `well_being_monitoring` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "well_being_monitoring" DROP COLUMN "disposition",
DROP COLUMN "musclePain",
ADD COLUMN     "energy" INTEGER NOT NULL,
ADD COLUMN     "fatigue" INTEGER NOT NULL,
ADD COLUMN     "motivation" INTEGER NOT NULL,
ADD COLUMN     "nutrition" INTEGER NOT NULL,
ADD COLUMN     "pain" INTEGER NOT NULL,
ADD COLUMN     "sleep_hours" INTEGER NOT NULL,
ADD COLUMN     "water_intake" INTEGER NOT NULL;
