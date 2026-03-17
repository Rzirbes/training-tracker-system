import { Inject, Injectable } from '@nestjs/common';
import { CreateCountryDto, GetCountriesResponseDto } from '../dtos';
import { CountryEntity } from '../entities';
import type { ICountryRepository } from '../repositories/country.repository';
import type { IBaseUseCase } from 'src/app/shared';

@Injectable()
export class CreateCountryUseCase implements IBaseUseCase {
  constructor(
    @Inject('ICountryRepository')
    private readonly countryRepository: ICountryRepository,
  ) {}

  public async execute({ name, code = '' }: CreateCountryDto) {
    const country = new CountryEntity({ name, code })
    const { uuid } = await this.countryRepository.create(country);

    return {
      id: uuid,
      message: 'País cadastrado com sucesso!'
    };
  }
}
