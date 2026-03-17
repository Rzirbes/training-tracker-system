/*
  Warnings:

  - You are about to drop the column `coach_id` on the `training_types` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "tokens" DROP CONSTRAINT "tokens_user_id_fkey";

-- DropForeignKey
ALTER TABLE "training_types" DROP CONSTRAINT "training_types_coach_id_fkey";

-- AlterTable
ALTER TABLE "training_types" DROP COLUMN "coach_id";

-- AddForeignKey
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
