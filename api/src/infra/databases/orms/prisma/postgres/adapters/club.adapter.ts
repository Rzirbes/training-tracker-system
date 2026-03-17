import { City, Club, Country, State } from '@prisma/client';
import { ClubEntity } from 'src/app/modules/club/entities';
import { CountryAdapter } from './country.adapter';
import { StateAdapter } from './state.adapter';
import { CityAdapter } from './city.adapter';

interface ClubDatabase extends Club {
  country: Country;
  state: State;
  city: City;
}

export class ClubAdapter {
  static fromEntity(entity: ClubEntity) {
    return {
      name: entity.getName(),
      isEnabled: entity.getIsEnabled(),
      country: {
        connect: {
          uuid: entity.getCountryId(),
        },
      },
      state: {
        connect: {
          uuid: entity.getStateId(),
        },
      },
      city: {
        connect: {
          uuid: entity.getCityId(),
        },
      },
    };
  }

  static fromDB({ country, state, city, ...club }: ClubDatabase) {
    return new ClubEntity({
      ...club,
      countryId: country.uuid,
      stateId: state.uuid,
      cityId: city.uuid,
      country: CountryAdapter.adapterFromDB(country),
      state: StateAdapter.adapterFromDB(state),
      city: CityAdapter.adapterFromDB({
        ...city,
        state,
      }),
    });
  }

  static manyFromDB(clubs: ClubDatabase[]) {
    return clubs.map(this.fromDB);
  }
}
