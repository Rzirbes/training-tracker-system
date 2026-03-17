import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CityEntity } from '../entities';
import type { ICityRepository } from '../repositories/city.repository';

@Injectable()
export class RetrieveCityValidatedByStateUseCase {
  constructor(
    @Inject('ICityRepository')
    private readonly cityRepository: ICityRepository,
  ) {}

  public async validate(cityId: string, stateId: string): Promise<CityEntity> {
    const city = await this.cityRepository.findByUuid(cityId);

    if (!city) {
      throw new NotFoundException({
        title: 'Cidade não encontrada!',
        message: 'Verifique e tente novamente...',
      });
    }

    if (city.getStateId() !== stateId) {
      throw new BadRequestException({
        title: 'Estado inválido!',
        message: 'Verifique e tente novamente...',
      });
    }

    return city;
  }
}
