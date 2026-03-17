import { FindCoachByUuidQuery, GetCoachesRequestDto } from '../dtos';
import { CoachEntity } from '../entities';

export interface ICoachRepository {
  count(query: GetCoachesRequestDto): Promise<number>;
  create(coach: CoachEntity): Promise<{ id: number; userId: number }>;
  findAll(query: GetCoachesRequestDto): Promise<CoachEntity[]>;
  findByEmail(email: string): Promise<CoachEntity | null>;
  findByUuid(
    email: string,
    query?: FindCoachByUuidQuery,
  ): Promise<CoachEntity | null>;
  update(coach: CoachEntity): Promise<void>;
  updateStatus(coach: CoachEntity): Promise<void>;
}
