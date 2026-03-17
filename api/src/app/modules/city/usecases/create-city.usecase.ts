import { Inject, Injectable } from '@nestjs/common';
import { transformer, type IBaseUseCase } from 'src/app/shared';
import { ICityRepository } from '../repositories';
import { CreateCityDto } from '../dtos';
import { CityEntity } from '../entities';

@Injectable()
export class CreateCityUseCase implements IBaseUseCase {
  constructor(
    @Inject('ICityRepository')
    private readonly cityRepository: ICityRepository,
  ) {}

  public async execute({ name, stateId }: CreateCityDto) {
    const city = new CityEntity();
    city.setName(name)
    city.setSlug(transformer.slug(name))
    city.setIsEnabled(true)
    city.setStateId(stateId)
    const { uuid } = await this.cityRepository.create(city);

    return {
      id: uuid,
      message: 'Cidade cadastrada com sucesso!'
    };
  }
}
