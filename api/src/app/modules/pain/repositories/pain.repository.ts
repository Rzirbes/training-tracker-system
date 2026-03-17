import { PaginateRequestDto } from "src/app/shared";
import { PainEntity } from "../entities";

interface Search {
  athleteId: number
  startDate?: Date;
  endDate?: Date;
}

interface Paginate extends Search, PaginateRequestDto {}

export interface IPainRepository {
  createMany(injuries: PainEntity[]): Promise<void>;
  list(search: Paginate): Promise<PainEntity[]>;
  count(search: Paginate): Promise<number>;
  findMany(search: Search): Promise<PainEntity[]>;
  findByUuid(uuid: string): Promise<PainEntity>;
  delete(id: number): Promise<void>;
  update(injury: PainEntity): Promise<void>;
  updateMany(injuries: PainEntity[]): Promise<void>;
  deleteMany(injuries: PainEntity[]): Promise<void>;
} 