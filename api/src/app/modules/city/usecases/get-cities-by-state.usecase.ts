import { Inject, Injectable } from '@nestjs/common';
import { GetCitiesResponseDto } from '../dtos/get-cities-response.dto';
import { CityEntity } from '../entities';
import type { ICityRepository } from '../repositories/city.repository';
import type { IBaseUseCase } from 'src/app/shared';

@Injectable()
export class GetCitiesByStateUseCase implements IBaseUseCase {
  constructor(
    @Inject('ICityRepository')
    private readonly cityRepository: ICityRepository,
  ) {}

  public async execute(stateId: string): Promise<GetCitiesResponseDto> {
    return {
      cities: (await this.cityRepository.findByStateId(stateId)).map(
        (city: CityEntity) => ({
          value: city.getUuid(),
          label: city.getName(),
        }),
      ),
    };
  }
}
