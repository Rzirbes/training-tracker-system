import { StateEntity } from 'src/app/modules/state/entities';
import * as statesData from './data/states.json';
import { prismaSeed } from '.';

export async function stateSeed() {
  const states = generateStates();

  return Promise.all(
    states.map((state) =>
      prismaSeed.state.upsert({
        where: { uuid: state.getUuid() },
        create: {
          id: state.getId(),
          uuid: state.getUuid(),
          name: state.getName(),
          uf: state.getUf(),
          isEnabled: state.getIsEnabled(),
          country: {
            connect: {
              uuid: state.getCountryId(),
            },
          },
        },
        update: {
          name: state.getName(),
          uf: state.getUf(),
          isEnabled: state.getIsEnabled(),
          country: {
            connect: {
              uuid: state.getCountryId(),
            },
          },
        },
      }),
    ),
  );
}

function generateStates() {
  const states: StateEntity[] = [];

  for (const stateData of statesData) {
    const state = new StateEntity();

    state.setId(stateData.id);
    state.setUuid(stateData.uuid);
    state.setName(stateData.name);
    state.setUf(stateData.uf);
    state.setIsEnabled(true);
    state.setCountryId(stateData.country_uuid);

    states.push(state);
  }

  return states;
}
