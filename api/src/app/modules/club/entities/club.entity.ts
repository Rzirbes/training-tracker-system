import { BaseEntity, IBaseConstructor, transformer } from "src/app/shared";
import { CityEntity } from "../../city/entities";
import { StateEntity } from "../../state/entities";
import { CountryEntity } from "../../country/entities";

export class ClubEntity extends BaseEntity {
  private name: string;
  private countryId: string;
  private stateId: string;
  private cityId: string;
  private isEnabled: boolean;
  private country?: CountryEntity;
  private state?: StateEntity;
  private city?: CityEntity;

  constructor({
    id,
    uuid,
    createdAt,
    updatedAt,
    name,
    countryId,
    cityId,
    stateId,
    isEnabled = true,
    country,
    state,
    city,
  }: IConstructor) {
    super(id, uuid, createdAt, updatedAt);
    this.name = transformer.nameToTitleCase(name);
    this.countryId = countryId;
    this.stateId = stateId;
    this.cityId = cityId;
    this.isEnabled = isEnabled;
    this.country = country;
    this.state = state;
    this.city = city;
  }

  public getName(): string {
    return this.name;
  }

  public getCountryId(): string {
    return this.countryId;
  }

  public getStateId(): string {
    return this.stateId;
  }

  public getCityId(): string {
    return this.cityId;
  }

  public getIsEnabled(): boolean {
    return this.isEnabled;
  }

  public getCountry(): CountryEntity {
    return this.country;
  }

  public getState(): StateEntity {
    return this.state;
  }

  public getCity(): CityEntity {
    return this.city;
  }
}

interface IConstructor extends IBaseConstructor {
  name: string;
  countryId: string;
  stateId: string;
  cityId: string;
  isEnabled?: boolean;
  country?: CountryEntity;
  state?: StateEntity;
  city?: CityEntity;
}