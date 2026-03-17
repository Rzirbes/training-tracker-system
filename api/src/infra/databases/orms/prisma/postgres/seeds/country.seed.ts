import { CountryEntity } from 'src/app/modules/country/entities';
import * as countriesData from './data/countries.json';
import { prismaSeed } from '.';

export async function countrySeed() {
  const countries = generateCountries();

  return Promise.all(
    countries.map((country) =>
      prismaSeed.country.upsert({
        where: { uuid: country.getUuid() },
        create: {
          id: country.getId(),
          code: country.getCode(),
          name: country.getName(),
          uuid: country.getUuid(),
          isEnabled: country.getIsEnabled(),
        },
        update: {
          name: country.getName(),
          code: country.getCode(),
          isEnabled: country.getIsEnabled(),
        },
      }),
    ),
  );
}

function generateCountries() {
  const countries: CountryEntity[] = [];

  for (const { name, code, id, uuid } of countriesData) {
    countries.push(new CountryEntity({
      id,
      uuid,
      name,
      code,
      isEnabled: true,
    }));
  }

  return countries;
}
