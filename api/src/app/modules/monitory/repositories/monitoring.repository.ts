import { MonitoryEntity } from '../entities';

export interface IMonitoryRepository {
  upsertWeekLoad(week: MonitoryEntity): Promise<void>;
  findWeeks(athleteId: number, weeks: string[]): Promise<MonitoryEntity[]>;
}
