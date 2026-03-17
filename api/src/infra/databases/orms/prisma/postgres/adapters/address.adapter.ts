import { Address, City, Country, State } from "@prisma/client";
import { CityEntity } from "src/app/modules/city/entities";
import { AddressEntity } from "src/app/shared";
import { CityAdapter } from "./city.adapter";
import { StateAdapter } from "./state.adapter";
import { CountryAdapter } from "./country.adapter";

export interface AddressWithEntitiesFromDB extends Address {
  country: Country;
  city: City;
  state: State
}

export class AddressAdapter {
  static fromDB(address: AddressWithEntitiesFromDB): AddressEntity {
    return new AddressEntity({
      buildingNumber: address?.buildingNumber ?? '',
      cityId: address?.city?.uuid ?? '',
      countryId: address?.country?.uuid ?? '',
      neighborhood: address?.neighborhood ?? '',
      stateId: address?.state?.uuid ?? '',
      street: address?.street ?? '',
      zipCode: address?.zipCode ?? '',
      complement: address?.complement ?? '',
      ...(!!address?.country && {
        country: CountryAdapter.adapterFromDB(address.country),
      }),
      ...(!!address?.state && {
        state: StateAdapter.adapterFromDB(address.state),
      }),
      ...(!!address?.city && {
        city: CityAdapter.adapterFromDB({
          ...address?.city,
          state: address?.state,
        }),
      }),
    });
  }
}