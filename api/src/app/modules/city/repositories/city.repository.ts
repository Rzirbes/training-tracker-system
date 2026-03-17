import { CityEntity } from '../entities/city.entity';

export interface ICityRepository {
  findByStateId(stateId: string): Promise<CityEntity[]>;
  findByUuid(cityId: string): Promise<CityEntity | null>;
  findByName(name: string, stateId: string): Promise<CityEntity | null>;
  findById(id: number, stateId?: number): Promise<CityEntity | null>;
  create(city: CityEntity): Promise<{ uuid: string }>;
}
