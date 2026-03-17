import { ClubEntity } from "../entities";


export interface IClubRepository {
  create(club: ClubEntity): Promise<{ uuid: string }>;
  findAll(query?: {
    city?: string;
    isEnabled?: boolean;
  }): Promise<ClubEntity[]>;
  findByUuid(uuid: string[]): Promise<ClubEntity[]>;
} 