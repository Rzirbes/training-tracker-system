import { AbsenceScheduleEntity } from '../entities';
import { ScheduleEntity } from '../entities/schedule.entity';

export interface IScheduleRepository extends AbsenceRepository {
  create(schedule: ScheduleEntity): Promise<{ uuid: string }>;
  find(query?: Find): Promise<ScheduleEntity[]>;
  findByUuid(uuid: string): Promise<ScheduleEntity | null>;
  update(schedule: ScheduleEntity): Promise<void>;
  confirm(schedule: ScheduleEntity): Promise<void>;
  cancel(schedule: ScheduleEntity): Promise<void>;
  delete(schedule: ScheduleEntity): Promise<void>;
  finish(schedule: ScheduleEntity): Promise<void>;
  detectWorkoutConflict(
    query: DetectConflict,
  ): Promise<{ athlete: boolean; coach: boolean }>;
}

interface AbsenceRepository {
  createAbsence(absence: AbsenceScheduleEntity): Promise<{ uuid: string }>;
  updateAbsence(absence: AbsenceScheduleEntity): Promise<void>;
  findAbsences(query: Find): Promise<AbsenceScheduleEntity[]>;
  detectAbsence(query: DetectAbsence): Promise<boolean>;
  findAbsenceByUuid(uuid: string): Promise<AbsenceScheduleEntity | null>;
  deleteAbsence(absence: AbsenceScheduleEntity): Promise<void>;
}

interface Find extends Period {
  userId?: number;
}

interface DetectAbsence extends Period, Omit<Entities, 'athleteId'> {}

interface DetectConflict extends Period, Entities {}

interface Period {
  start: Date;
  end: Date;
}

interface Entities {
  athleteId: number;
  coachId: number;
  notId?: number;
}
