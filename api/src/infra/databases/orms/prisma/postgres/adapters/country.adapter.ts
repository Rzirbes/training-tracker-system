import { CountryEntity } from 'src/app/modules/country/entities';
import type { Country } from '@prisma/client';

export class CountryAdapter {
  static fromEntity(country: CountryEntity) {
    return {
      id: country.getId(),
      name: country.getName(),
      code: country.getCode(),
      isEnabled: country.getIsEnabled(),
    };
  }

  static adapterFromDB({
    uuid,
    name,
    code,
    id,
    isEnabled,
    createdAt,
    updatedAt,
  }: Country): CountryEntity {
    const country = new CountryEntity({
      uuid,
      name,
      code,
      id,
      isEnabled,
      createdAt,
      updatedAt,
    });
    return country;
  }

  static adapterManyFromDB(countries: Country[]): CountryEntity[] {
    return countries.map((country) => CountryAdapter.adapterFromDB(country));
  }
}
