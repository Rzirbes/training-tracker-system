import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateTrainingTypeDto } from '../dtos';
import type { IBaseUseCase } from 'src/app/shared';
import type { ITrainingTypeRepository } from '../repositories';

@Injectable()
export class UpdateTrainingTypeUseCase implements IBaseUseCase {
  constructor(
    @Inject('ITrainingTypeRepository')
    private readonly trainingTypeRepository: ITrainingTypeRepository,
  ) {}

  async execute(input: UpdateTrainingTypeDto): Promise<void> {
    const { uuid } = input;
    const trainingType = await this.trainingTypeRepository.findByUuid(uuid);

    if (!trainingType)
      throw new NotFoundException({
        title: 'Tipo de Treino não encontrado!',
        message: 'Verifique e tente novamente...',
      });

    trainingType.update(input);

    await this.trainingTypeRepository.update(trainingType);
  }
}
