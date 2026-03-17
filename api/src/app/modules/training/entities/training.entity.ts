import { BaseEntity, type IBaseConstructor } from 'src/app/shared';
import { TrainingTypeEntity } from '../../training-type';
import { TrainingPlanningEntity } from '../../training-planning';
import { InjuryEntity } from '../../injury/entities';
import { PainEntity } from '../../pain/entities';

interface IConstructor extends IBaseConstructor {
  athleteId: number;
  date: Date;
  trainingTypeId: number;
  duration: number;
  pse: number;
  psr: number;
  description?: string;
  trainingType?: TrainingTypeEntity;
  injuries?: InjuryEntity[];
  pains?: PainEntity[];
}

export class TrainingEntity extends BaseEntity {
  private athleteId: number;
  private date: Date;
  private trainingTypeId: number;
  private duration: number;
  private pse: number;
  private psr: number;
  private description?: string;
  private trainingType?: TrainingTypeEntity;
  private injuries: InjuryEntity[];
  private pains: PainEntity[];

  constructor({
    athleteId,
    date,
    trainingTypeId,
    duration,
    pse,
    psr,
    description,
    id,
    uuid,
    createdAt,
    updatedAt,
    trainingType,
    injuries = [],
    pains = [],
  }: IConstructor) {
    super(id, uuid, createdAt, updatedAt);
    this.athleteId = athleteId;
    this.date = date;
    this.trainingTypeId = trainingTypeId;
    this.duration = duration;
    this.description = description;
    this.pse = pse;
    this.psr = psr;
    this.trainingType = trainingType;
    this.injuries = injuries;
    this.pains = pains;
  }

  public update({
    date,
    duration,
    pse,
    description,
    psr,
  }: Omit<IConstructor, 'athleteId' | 'trainingTypeId'>): void {
    this.date = date;
    this.duration = duration;
    this.description = description;
    this.pse = pse;
    this.psr = psr;
  }

  public updateTrainingTypeId(trainingTypeId: number) {
    this.trainingTypeId = trainingTypeId;
  }

  public getAthleteId(): number {
    return this.athleteId;
  }

  public getTrainingTypeId(): number {
    return this.trainingTypeId;
  }

  public getDate(): Date {
    return this.date;
  }

  public getDescription(): string {
    return this.description;
  }

  public getDuration(): number {
    return this.duration;
  }

  public getPSE(): number {
    return this.pse;
  }

  public getPSR(): number {
    return this.psr;
  }

  public getTrainingType(): TrainingTypeEntity {
    return this.trainingType;
  }

  public getLoad(): number {
    return this.duration * this.pse;
  }

  public getInjuries(): InjuryEntity[] {
    return this.injuries;
  }

  public getPains(): PainEntity[] {
    return this.pains;
  }
}
