import { Inject, Injectable } from '@nestjs/common';
import { GetCountriesResponseDto } from '../dtos';
import { CountryEntity } from '../entities';
import type { ICountryRepository } from '../repositories/country.repository';
import type { IBaseUseCase } from 'src/app/shared';

@Injectable()
export class GetCountriesUseCase implements IBaseUseCase {
  constructor(
    @Inject('ICountryRepository')
    private readonly countryRepository: ICountryRepository,
  ) {}

  public async execute(all = false): Promise<GetCountriesResponseDto> {
    const callback = (country: CountryEntity) => ({
      value: country.getUuid(),
      label: country.getName(),
    });

    if (all) {
      return {
        countries: (await this.countryRepository.findAll()).map(callback),
      };
    }

    const countries = await this.countryRepository.findEnables();

    return {
      countries: countries.map(callback),
    };
  }
}
