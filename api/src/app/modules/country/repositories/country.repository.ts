import { CountryEntity } from '../entities/country.entity';

export interface ICountryRepository {
  findEnables(): Promise<CountryEntity[]>;
  findAll(): Promise<CountryEntity[]>;
  findByUuid(country: string): Promise<CountryEntity | null>;
  create(country: CountryEntity): Promise<{ uuid: string }>;
}
