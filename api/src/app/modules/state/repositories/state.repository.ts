import { StateEntity } from '../entities/state.entity';

export interface IStateRepository {
  findEnables(): Promise<StateEntity[]>;
  findAll(): Promise<StateEntity[]>;
  findByUuid(state: string): Promise<StateEntity | null>;
  findById(id: number): Promise<StateEntity | null>;
  changeIsEnabledByUuid(uuid: string, isEnabled: boolean): Promise<void>;
  findByUf(uf: string): Promise<StateEntity | null>;
  findByCountryId(countryId: string): Promise<StateEntity[]>;
  create(state: StateEntity): Promise<{ uuid: string }>;
}
