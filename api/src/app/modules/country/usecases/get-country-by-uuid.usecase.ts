import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CountryEntity } from '../entities';
import type { IBaseUseCase } from 'src/app/shared';
import type { ICountryRepository } from '../repositories/country.repository';

@Injectable()
export class GetCountryByUuidUseCase implements IBaseUseCase {
  constructor(
    @Inject('ICountryRepository')
    private readonly countryRepository: ICountryRepository,
  ) {}

  public async execute(countryId: string): Promise<CountryEntity> {
    const country = await this.countryRepository.findByUuid(countryId);

    if (!country)
      throw new NotFoundException({
        title: 'País não encontrado!',
        message: 'Verifique e tente novamente...',
      });

    return country;
  }
}
