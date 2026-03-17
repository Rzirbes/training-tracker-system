import { BaseEntity, IBaseConstructor } from "src/app/shared";
import { ClubEntity } from "../../club/entities";

export class AthleteClubEntity extends BaseEntity {
  private clubId: string;
  private startDate: Date;
  private endDate?: Date;
  private club?: ClubEntity;
  private athleteId?: number;

  constructor({
    id,
    uuid,
    createdAt,
    updatedAt,
    club,
    clubId,
    startDate,
    endDate,
    athleteId,
  }: IConstructor) {
    super(id, uuid, createdAt, updatedAt);
    this.club = club;
    this.clubId = clubId;
    this.startDate = new Date(startDate);
    this.athleteId = athleteId;
    if (endDate) this.endDate = new Date(endDate);
  }

  public getClubId(): string {
    return this.clubId;
  }

  public getClub(): ClubEntity {
    return this.club;
  }

  public getStartDate(): Date {
    return this.startDate;
  }
  public getEndDate(): Date {
    return this.endDate;
  }

  public getAthleteId(): number {
    return this.athleteId
  };

  public update({
    clubId,
    startDate,
    endDate,
  }: Omit<IConstructor, 'athleteId'>) {
    this.clubId = clubId;
    this.startDate = new Date(startDate);
    if (endDate) this.endDate = new Date(endDate);
  }
}

interface IConstructor extends IBaseConstructor {
  clubId: string;
  startDate: Date;
  endDate?: Date;
  club?: ClubEntity;
  athleteId?: number;
}