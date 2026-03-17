import { AbsenceScheduleEntity } from '../entities';

export class FindAbsenceScheduleByUuidResponseDto {
  type = 'BLOCK_TIME';

  id: string;
  start: Date;
  end: Date;
  description: string;
  trainer: {
    id: string;
    name: string;
    color: string;
  };

  constructor(entity: AbsenceScheduleEntity) {
    const coach = entity.getCoach();

    this.id = entity.getUuid();
    this.start = entity.getStart();
    this.end = entity.getEnd();
    this.description = entity.getDescription();
    this.trainer = {
      id: coach.getUuid(),
      name: coach.getName(),
      color: coach.getSchedulerColor(),
    };
  }
}
