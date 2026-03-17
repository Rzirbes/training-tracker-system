/*
  Warnings:

  - Added the required column `coach_id` to the `athletes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `coach_id` to the `training-types` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "athletes_email_key";

-- AlterTable
ALTER TABLE "athletes" ADD COLUMN     "coach_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "training-types" ADD COLUMN     "coach_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "athletes" ADD CONSTRAINT "athletes_coach_id_fkey" FOREIGN KEY ("coach_id") REFERENCES "coaches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training-types" ADD CONSTRAINT "training-types_coach_id_fkey" FOREIGN KEY ("coach_id") REFERENCES "coaches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
