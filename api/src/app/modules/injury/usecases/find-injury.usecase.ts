import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { GetInjuryResponseDto } from '../dtos';
import {
  bodySides,
  degreeLabels,
  injuryContexts,
  type IBaseUseCase
} from 'src/app/shared';
import type { IInjuryRepository } from '../repositories';

@Injectable()
export class FindInjuryUseCase implements IBaseUseCase {
  constructor(
    @Inject('IInjuryRepository')
    private readonly injuryRepository: IInjuryRepository,
  ) {}

  async execute(uuid: string): Promise<GetInjuryResponseDto> {
    const entity = await this.injuryRepository.findByUuid(uuid);

    if (!entity)
      throw new NotFoundException({
        title: 'Lesão não encontrada!',
        message: 'Verifique e tente novamente...',
      });
    

    return entity.toJSON();
  }
}
