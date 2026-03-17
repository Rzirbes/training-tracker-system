import { CityEntity } from 'src/app/modules/city/entities';
import * as citiesData from './data/cities.json';
import { prismaSeed } from '.';

export async function citySeed(states: any[]) {
  const cities = generateCities();

  const citiesToCreateWithState = cities.map((city) => {
    const state = states.find((state) => state.uuid === city.getStateId());
    return {
      id: city.getId(),
      uuid: city.getUuid(),
      name: city.getName(),
      isEnabled: city.getIsEnabled(),
      stateId: state.id,
      slug: city.getSlug(),
    };
  });

  await prismaSeed.city.createMany({
    data: citiesToCreateWithState,
    skipDuplicates: true,
  });

  return cities;
}

function generateCities() {
  const cities: CityEntity[] = [];

  for (const [index, cityData] of citiesData.entries()) {
    const city = new CityEntity();
    city.setId(index + 1);
    city.setUuid(cityData.uuid);
    city.setName(cityData.name);
    city.setStateId(cityData.state_uuid);
    city.setIsEnabled(true);

    cities.push(city);
  }

  return cities;
}
