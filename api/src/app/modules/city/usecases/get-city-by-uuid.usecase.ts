import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CityEntity } from '../entities';
import type { IBaseUseCase } from 'src/app/shared';
import type { ICityRepository } from '../repositories/city.repository';

@Injectable()
export class GetCityByUuidUseCase implements IBaseUseCase {
  constructor(
    @Inject('ICityRepository')
    private readonly cityRepository: ICityRepository,
  ) {}

  public async execute(cityId: string): Promise<CityEntity> {
    const city = await this.cityRepository.findByUuid(cityId);

    if (!city)
      throw new NotFoundException({
        title: 'Cidade não encontrada!',
        message: 'Verifique e tente novamente...',
      });

    return city;
  }
}
