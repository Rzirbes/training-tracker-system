import { AddressDto, BaseEntity, IBaseConstructor } from 'src/app/shared';
import { CityEntity } from '../../modules/city/entities';
import { StateEntity } from '../../modules/state/entities';
import { CountryEntity } from 'src/app/modules/country/entities';

interface IProps extends AddressDto {
  city?: CityEntity;
  state?: StateEntity;
  country?: CountryEntity;
}

export class AddressEntity {
  private zipCode?: string;
  private countryId?: string;
  private stateId?: string;
  private cityId?: string;
  private street?: string;
  private neighborhood?: string;
  private buildingNumber?: string;
  private complement?: string;
  private city?: CityEntity;
  private state?: StateEntity;
  private country?: CountryEntity;

  constructor({
    street,
    buildingNumber,
    neighborhood,
    stateId,
    cityId,
    complement,
    zipCode,
    countryId,
    city,
    country,
    state,
  }: IProps) {
    this.street = street ?? undefined;
    this.buildingNumber = buildingNumber ?? undefined;
    this.neighborhood = neighborhood ?? undefined;
    this.countryId = countryId ?? undefined;
    this.stateId = stateId ?? undefined;
    this.cityId = cityId ?? undefined;
    this.complement = complement ?? undefined;
    this.zipCode = zipCode ?? undefined;
    this.country = country;
    this.state = state;
    this.city = city;
  }

  public getStreet(): string | undefined {
    return this.street;
  }

  public getNeighborhood(): string | undefined {
    return this.neighborhood;
  }

  public getBuildingNumber(): string | undefined {
    return this.buildingNumber;
  }

  public getComplement(): string | undefined {
    return this.complement ?? '';
  }

  public getZipCode(): string | undefined {
    return this.zipCode;
  }

  public getCityId(): string | undefined {
    return this.cityId;
  }

  public getStateId(): string | undefined {
    return this.stateId;
  }

  public getCity(): CityEntity {
    return this.city;
  }

  public getState(): StateEntity {
    return this.state;
  }

  public getZipCodeFormatted(): string | undefined {
    return this.zipCode.replace(/^(\d{2})(\d{3})(\d{3})$/, '$1.$2-$3');
  }

  public getDto(): AddressDto {
    return {
      countryId: this.countryId,
      stateId: this.stateId,
      cityId: this.cityId,
      street: this.street,
      buildingNumber: this.buildingNumber,
      neighborhood: this.neighborhood,
      zipCode: this.zipCode,
      complement: this.complement,
    };
  }

  public getCountry(): CountryEntity {
    return this.country;
  }

  public setCountry(country: CountryEntity): void {
    this.country = country;
  }

  public getCountryId(): string | undefined {
    return this.countryId;
  }

  public setCountryId(countryId: string): void {
    this.countryId = countryId;
  }
}
