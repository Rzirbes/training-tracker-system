-- AlterTable
ALTER TABLE "athletes" ADD COLUMN     "is_monitor_daily" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "positions" "FootballPosition"[];
