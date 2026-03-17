import { BaseEntity, IBaseConstructor } from 'src/app/shared';
import { CoachEntity } from '../../coaches/entities';

interface IAbsenceSchedule extends IBaseConstructor {
  start: Date;
  end: Date;
  coach: CoachEntity;
  description: string;
}

export class AbsenceScheduleEntity extends BaseEntity {
  private start: Date;
  private end: Date;
  private coach: CoachEntity;
  private description: string;

  constructor({
    start,
    end,
    coach,
    id,
    uuid,
    createdAt,
    updatedAt,
    description = 'Ausente',
  }: IAbsenceSchedule) {
    super(id, uuid, createdAt, updatedAt);
    this.start = new Date(start);
    this.end = new Date(end);
    this.coach = coach;
    this.description = description;
  }

  public getStart(): Date {
    return this.start;
  }

  public getEnd(): Date {
    return this.end;
  }

  public getCoach(): CoachEntity {
    return this.coach;
  }

  public getDescription(): string {
    return this.description;
  }

  public update({ start, end, coach, description }: IAbsenceSchedule) {
    this.start = new Date(start);
    this.end = new Date(end);
    this.coach = coach;
    this.description = description;
  }
}
