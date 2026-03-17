import {
  BaseEntity,
  BodySide,
  IBaseConstructor,
  InjuryContext,
  InjuryDegree,
  transformer,
} from 'src/app/shared';

export class InjuryEntity extends BaseEntity {
  private _athleteId: number;
  private _date: Date;
  private _type: string;
  private _bodyRegion: string;
  private _bodySide: BodySide;
  private _degree: InjuryDegree;
  private _occurredDuring: InjuryContext;
  private _description?: string;
  private _diagnosisConfirmed: boolean = false;
  private _examType?: string;
  private _requiresSurgery: boolean = false;
  private _surgeryDate?: Date;
  private _treatmentType?: string;
  private _returnDatePlanned?: Date;
  private _returnDateActual?: Date;
  private _minutesFirstGame?: number;
  private _notes?: string;
  private _trainingId?: number;

  constructor(params: Props) {
    super(params.id, params.uuid, params.createdAt, params.updatedAt);
    this._date = params.date;
    this._type = transformer.capitalizeFirstLetter(params.type);
    this._bodyRegion = transformer.nameToTitleCase(params.bodyRegion);
    this._bodySide = params.bodySide;
    this._degree = params.degree;
    this._occurredDuring = params.occurredDuring;
    this._description = transformer.capitalizeFirstLetter(params.description);
    this._diagnosisConfirmed = params.diagnosisConfirmed ?? false;
    this._examType = params.examType;
    this._requiresSurgery = params.requiresSurgery ?? false;
    this._surgeryDate = params.surgeryDate;
    this._treatmentType = params.treatmentType;
    this._returnDatePlanned = params.returnDatePlanned;
    this._returnDateActual = params.returnDateActual;
    this._minutesFirstGame = params.minutesFirstGame;
    this._notes = params.notes;
    this._athleteId = params.athleteId;
    this._trainingId = params.trainingId;
  }

  public getDate() {
    return this._date;
  }

  public getType() {
    return this._type;
  }

  public getBodyRegion() {
    return this._bodyRegion;
  }

  public getBodySide() {
    return this._bodySide;
  }

  public getDegree() {
    return this._degree;
  }

  public getOccurredDuring() {
    return this._occurredDuring;
  }

  public getDiagnosisConfirmed() {
    return this._diagnosisConfirmed;
  }

  public getRequiresSurgery() {
    return this._requiresSurgery;
  }

  public getAthleteId() {
    return this._athleteId;
  }

  public getReturnDatePlanned() {
    return this._returnDatePlanned;
  }

  public getReturnDateActual() {
    return this._returnDateActual;
  }

  public getExamType() {
    return this._examType;
  }

  public getMinutesFirstGame() {
    return this._minutesFirstGame;
  }

  public confirmDiagnosis() {
    this._diagnosisConfirmed = true;
    this.touch();
  }

  private touch() {
    this.setUpdatedAt(new Date());
  }

  public getTrainingId() {
    return this._trainingId;
  }

  public update(params: Omit<Props, 'athleteId'>) {
    this._date = params.date;
    this._type = transformer.capitalizeFirstLetter(params.type);
    this._bodyRegion = params.bodyRegion;
    this._bodySide = params.bodySide;
    this._degree = params.degree;
    this._occurredDuring = params.occurredDuring;
    this._description = params.description;
    this._diagnosisConfirmed = params.diagnosisConfirmed ?? false;
    this._examType = params.examType;
    this._requiresSurgery = params.requiresSurgery ?? false;
    this._surgeryDate = params.surgeryDate;
    this._treatmentType = params.treatmentType;
    this._minutesFirstGame = params.minutesFirstGame;
    this._notes = params.notes;

    if (params.returnDatePlanned) {
      this._returnDatePlanned = params.returnDatePlanned;
    }

    if (params.returnDateActual) {
      this._returnDateActual = params.returnDateActual;
    }
  }

  public toJSON() {
    const returnDatePlanned = this._returnDatePlanned;
    const returnDateActual = this._returnDateActual;
    const surgeryDate = this._surgeryDate;
    const notes = this._notes;
    const examType = this._examType;
    const minutesFirstGame = this._minutesFirstGame;
    const treatmentType = this._treatmentType;

    return {
      date: this._date,
      type: this._type,
      bodyRegion: this._bodyRegion,
      bodySide: this._bodySide,
      degree: this._degree,
      occurredDuring: this._occurredDuring,
      description: this._description,
      diagnosisConfirmed: this._diagnosisConfirmed,
      requiresSurgery: this._requiresSurgery,
      ...(!!treatmentType && { treatmentType }),
      ...(!!examType && { examType }),
      ...(!!minutesFirstGame && { minutesFirstGame }),
      ...(!!notes && { notes }),
      ...(!!surgeryDate && { surgeryDate }),
      ...(!!returnDatePlanned && { returnDatePlanned }),
      ...(!!returnDateActual && { returnDateActual }),
    };
  }
}

interface Props extends IBaseConstructor {
  date: Date;
  type: string;
  bodyRegion: string;
  bodySide: BodySide;
  degree: InjuryDegree;
  occurredDuring: InjuryContext;
  description?: string;
  diagnosisConfirmed?: boolean;
  examType?: string;
  requiresSurgery?: boolean;
  surgeryDate?: Date;
  treatmentType?: string;
  returnDatePlanned?: Date;
  returnDateActual?: Date;
  minutesFirstGame?: number;
  notes?: string;
  athleteId?: number;
  trainingId?: number;
}
