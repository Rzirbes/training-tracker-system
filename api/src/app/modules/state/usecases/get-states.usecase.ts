import { Inject, Injectable } from '@nestjs/common';
import { GetStatesResponseDto } from '../dtos';
import { StateEntity } from '../entities';
import type { IStateRepository } from '../repositories/state.repository';
import type { IBaseUseCase } from 'src/app/shared';

@Injectable()
export class GetStatesUseCase implements IBaseUseCase {
  constructor(
    @Inject('IStateRepository')
    private readonly stateRepository: IStateRepository,
  ) {}

  public async execute(all = false): Promise<GetStatesResponseDto> {
    const callback = (state: StateEntity) => ({
      value: state.getUuid(),
      label: state.getLabel(),
    });

    if (all) {
      return {
        states: (await this.stateRepository.findAll()).map(callback),
      };
    }

    return {
      states: (await this.stateRepository.findEnables()).map(callback),
    };
  }
}
