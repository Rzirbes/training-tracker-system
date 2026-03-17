import { BaseEntity, IBaseConstructor } from 'src/app/shared';
import { AthleteEntity } from '../../athlete';
import { CoachEntity } from '../../coaches/entities';
import { TrainingPlanningEntity } from '../../training-planning';

interface ISchedule extends IBaseConstructor {
  start: Date;
  end: Date;
  coach: CoachEntity;
  athlete: AthleteEntity;
  trainingPlanning: TrainingPlanningEntity;
  confirmed?: boolean;
  canceled?: boolean;
  finishTrainingId?: number;
}

type IUpdateSchedule = Pick<
  ISchedule,
  'start' | 'end' | 'coach' | 'trainingPlanning'
>;

export class ScheduleEntity extends BaseEntity {
  private start: Date;
  private end: Date;
  private coach: CoachEntity;
  private athlete: AthleteEntity;
  private trainingPlanning: TrainingPlanningEntity;
  private confirmed: boolean;
  private canceled: boolean;
  private completed: boolean;
  private finishedTrainingUuid?: string;

  constructor({
    start,
    end,
    coach,
    athlete,
    trainingPlanning,
    id,
    uuid,
    createdAt,
    updatedAt,
    canceled = false,
    confirmed = false,
    finishTrainingId,
  }: ISchedule) {
    super(id, uuid, createdAt, updatedAt);
    this.start = new Date(start);
    this.end = new Date(end);
    this.athlete = athlete;
    this.coach = coach;
    this.trainingPlanning = trainingPlanning;
    this.canceled = canceled;
    this.confirmed = confirmed;
    this.completed = Boolean(finishTrainingId);
  }

  public getStart(): Date {
    return this.start;
  }

  public getEnd(): Date {
    return this.end;
  }

  public getAthlete(): AthleteEntity {
    return this.athlete;
  }

  public getCoach(): CoachEntity {
    return this.coach;
  }

  public getTrainingPlanning(): TrainingPlanningEntity {
    return this.trainingPlanning;
  }

  public getConfirmed(): boolean {
    return this.confirmed;
  }

  public getCanceled(): boolean {
    return this.canceled;
  }

  public getCompleted(): boolean {
    return this.completed;
  }

  public update({ start, end, coach, trainingPlanning }: IUpdateSchedule) {
    this.start = new Date(start);
    this.end = new Date(end);
    this.coach = coach;
    this.trainingPlanning = trainingPlanning;
  }

  public cancel() {
    this.canceled = true;
    this.confirmed = false;
  }

  public confirm() {
    this.confirmed = true;
    this.canceled = false;
  }

  public finish(finishedTrainingUuid: string) {
    this.finishedTrainingUuid = finishedTrainingUuid;
  }

  public getIsFinished(): string | undefined {
    return this.finishedTrainingUuid;
  }
}
