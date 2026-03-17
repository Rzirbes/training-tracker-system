import { PaginateRequestDto } from "src/app/shared";
import { InjuryEntity } from "../entities";

interface Search {
  athleteId: number
  startDate?: Date;
  endDate?: Date;
}

interface Paginate extends Search, PaginateRequestDto {}

export interface IInjuryRepository {
  createMany(injuries: InjuryEntity[]): Promise<void>;
  list(search: Paginate): Promise<InjuryEntity[]>;
  count(search: Paginate): Promise<number>;
  findMany(search: Search): Promise<InjuryEntity[]>;
  findByUuid(uuid: string): Promise<InjuryEntity>;
  delete(id: number): Promise<void>;
  update(injury: InjuryEntity): Promise<void>;
  updateMany(injuries: InjuryEntity[]): Promise<void>;
  deleteMany(injuries: InjuryEntity[]): Promise<void>;
} 