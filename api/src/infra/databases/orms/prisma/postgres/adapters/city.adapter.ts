import { CityEntity } from 'src/app/modules/city/entities';
import type { City } from '@prisma/client';

export interface CityDatabase extends City {
  state: {
    uuid: string;
  };
}

export class CityAdapter {
  static fromEntity(entity: CityEntity) {
    return {
      id: entity.getId(),
      name: entity.getName(),
      slug: entity.getSlug(),
      isEnabled: entity.getIsEnabled(),
      state: {
        connect: {
          uuid: entity.getStateId(),
        },
      },
    };
  }

  static adapterFromDB({ uuid, name, id, state }: CityDatabase): CityEntity {
    const city = new CityEntity();
    city.setId(id);
    city.setUuid(uuid);
    city.setName(name);
    city.setStateId(state.uuid);

    return city;
  }

  static adapterRawFromDB({ uuid, name, id }: CityDatabase): CityEntity {
    const city = new CityEntity();

    city.setId(id);
    city.setUuid(uuid);
    city.setName(name);

    return city;
  }

  static adapterManyFromDB(cities: CityDatabase[]): CityEntity[] {
    return cities.map((city) => CityAdapter.adapterRawFromDB(city));
  }
}
