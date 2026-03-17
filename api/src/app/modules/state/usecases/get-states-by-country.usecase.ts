import { Inject, Injectable } from '@nestjs/common';
import {  GetStatesResponseDto} from '../dtos';
import { StateEntity } from '../entities';
import type { IStateRepository } from '../repositories';
import type { IBaseUseCase } from 'src/app/shared';

@Injectable()
export class GetStatesByCountryUseCase implements IBaseUseCase {
  constructor(
    @Inject('IStateRepository')
    private readonly cityRepository: IStateRepository,
  ) {}

  public async execute(countryId: string): Promise<GetStatesResponseDto> {
    return {
      states: (await this.cityRepository.findByCountryId(countryId)).map(
        (state: StateEntity) => ({
          value: state.getUuid(),
          label: state.getName(),
        }),
      ),
    };
  }
}
