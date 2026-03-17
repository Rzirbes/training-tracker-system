import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { StateEntity } from '../entities';
import type { IBaseUseCase } from 'src/app/shared';
import type { IStateRepository } from '../repositories/state.repository';

@Injectable()
export class GetStateByUuidUseCase implements IBaseUseCase {
  constructor(
    @Inject('IStateRepository')
    private readonly stateRepository: IStateRepository,
  ) {}

  public async execute(stateId: string): Promise<StateEntity> {
    const state = await this.stateRepository.findByUuid(stateId);

    if (!state)
      throw new NotFoundException({
        title: 'Estado não encontrado!',
        message: 'Verifique e tente novamente...',
      });

    return state;
  }
}
