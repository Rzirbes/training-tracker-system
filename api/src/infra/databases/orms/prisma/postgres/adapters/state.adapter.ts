import { StateEntity } from 'src/app/modules/state/entities';
import type { State } from '@prisma/client';

export class StateAdapter {
  static fromEntity(entity: StateEntity) {
    return {
      id: entity.getId(),
      name: entity.getName(),
      uf: entity.getUf(),
      isEnabled: entity.getIsEnabled(),
      country: {
        connect: {
          uuid: entity.getCountryId(),
        },
      },
    };
  }

  static adapterFromDB({ uuid, name, uf, id, isEnabled }: State): StateEntity {
    const state = new StateEntity();
    state.setId(id);
    state.setUuid(uuid);
    state.setName(name);
    state.setUf(uf);
    state.setIsEnabled(isEnabled);

    return state;
  }

  static adapterManyFromDB(states: State[]): StateEntity[] {
    return states.map((state) => StateAdapter.adapterFromDB(state));
  }
}
