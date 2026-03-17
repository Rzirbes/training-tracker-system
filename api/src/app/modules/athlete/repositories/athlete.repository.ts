import { AthleteClubEntity, AthleteEntity } from '../entities';
import { ListAthletesRequestDto } from '../dtos';

export interface IAthleteRepository {
  create(athlete: AthleteEntity): Promise<void>;
  update(athlete: AthleteEntity): Promise<void>;
  findByEmail(email: string): Promise<AthleteEntity | null>;
  findByCpf(cpf: string): Promise<AthleteEntity | null>;
  findAll(data: IFindAll): Promise<AthleteEntity[]>;
  listAll(query: ListAthletesRequestDto): Promise<AthleteEntity[]>;
  count(query: ListAthletesRequestDto): Promise<number>;
  findByUuid(uuid: string): Promise<AthleteEntity | null>;
  searchByDayWithPlanningOrDailyMonitor(
    query: ISearchByDayWithPlanning,
  ): Promise<AthleteEntity[]>;
  addClubs(clubs: AthleteClubEntity[]): Promise<void>;
  updateClubs(clubs: AthleteClubEntity[]): Promise<void>;
  removeClubs(clubs: AthleteClubEntity[]): Promise<void>;
}

interface IUnsubscribeQuery {
  not?: { emails: string[] };
}

interface IEnabledQuery {
  isEnabled: boolean;
}

interface IFindAll extends IUnsubscribeQuery, IEnabledQuery {}

interface ISearchByDayWithPlanning extends IUnsubscribeQuery {
  day: Date;
}
