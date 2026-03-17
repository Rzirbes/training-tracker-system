import { Inject, Injectable } from '@nestjs/common';
import { StateEntity } from '../entities';
import { CreateStateDto } from '../dtos';
import { IStateRepository } from '../repositories';
import type { IBaseUseCase } from 'src/app/shared';

@Injectable()
export class CreateStateUseCase implements IBaseUseCase {
  constructor(
    @Inject('IStateRepository')
    private readonly stateRepository: IStateRepository,
  ) {}

  public async execute({ countryId, name, uf = '' }: CreateStateDto) {
    const state = new StateEntity();
    state.setName(name);
    state.setUf(uf);
    state.setIsEnabled(true);
    state.setCountryId(countryId);
    const { uuid } = await this.stateRepository.create(state);

    return {
      id: uuid,
      message: 'Estado cadastrado com sucesso!',
    };
  }
}
