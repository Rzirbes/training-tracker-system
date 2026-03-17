import {
  BaseEntity,
  BodySide,
  IBaseConstructor,
  InjuryContext,
  InjuryDegree,
  transformer,
} from 'src/app/shared';

export class PainEntity extends BaseEntity {
  private _athleteId: number;
  private _date: Date;
  private _intensity: number;
  private _bodyRegion: string;
  private _bodySide: BodySide;
  private _occurredDuring: InjuryContext;
  private _description?: string;
  private _trainingId?: number;

  constructor(params: Props) {
    super(params.id, params.uuid, params.createdAt, params.updatedAt);
    this._date = params.date;
    this._bodyRegion = transformer.nameToTitleCase(params.bodyRegion);
    this._bodySide = params.bodySide;
    this._occurredDuring = params.occurredDuring;
    this._description = transformer.capitalizeFirstLetter(params.description);
    this._intensity = params.intensity;
    this._athleteId = params.athleteId;
    this._trainingId = params.trainingId;
  }

  public getDate() {
    return this._date;
  }

  public getIntensity() {
    return this._intensity;
  }

  public getBodyRegion() {
    return this._bodyRegion;
  }

  public getBodySide() {
    return this._bodySide;
  }

  public getOccurredDuring() {
    return this._occurredDuring;
  }

  public getAthleteId() {
    return this._athleteId;
  }

  public getTrainingId() {
    return this._trainingId;
  }

  public update(params: Omit<Props, 'athleteId'>) {
    this._date = params.date;
    this._bodyRegion = params.bodyRegion;
    this._bodySide = params.bodySide;
    this._occurredDuring = params.occurredDuring;
    this._description = params.description;
    this._intensity = params.intensity;
  }

  public toJSON() {
    return {
      date: this._date,
      bodyRegion: this._bodyRegion,
      bodySide: this._bodySide,
      occurredDuring: this._occurredDuring,
      description: this._description,
      intensity: this._intensity,
    };
  }
}

interface Props extends IBaseConstructor {
  date: Date;
  bodyRegion: string;
  bodySide: BodySide;
  occurredDuring: InjuryContext;
  intensity: number;
  description?: string;
  athleteId?: number;
  trainingId?: number;
}
