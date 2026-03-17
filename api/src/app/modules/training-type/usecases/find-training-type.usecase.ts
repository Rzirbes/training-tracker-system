import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FindTrainingTypeDto } from '../dtos/find-training-type.dto';
import type { IBaseUseCase } from 'src/app/shared';
import type { ITrainingTypeRepository } from '../repositories';

@Injectable()
export class FindTrainingTypeUseCase implements IBaseUseCase {
  constructor(
    @Inject('ITrainingTypeRepository')
    private readonly trainingTypeRepository: ITrainingTypeRepository,
  ) {}

  async execute(uuid: string): Promise<FindTrainingTypeDto> {
    const trainingType = await this.trainingTypeRepository.findByUuid(uuid);

    if (!trainingType)
      throw new NotFoundException({
        title: 'Tipo de Treino não encontrado!',
        message: 'Verifique e tente novamente...',
      });

    return {
      id: trainingType.getUuid(),
      name: trainingType.getName(),
      isEnabled: trainingType.getIsEnabled(),
    };
  }
}
