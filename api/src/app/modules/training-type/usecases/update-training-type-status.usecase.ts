import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IBaseUseCase } from 'src/app/shared';
import type { ITrainingTypeRepository } from '../repositories';

@Injectable()
export class UpdateTrainingTypeStatusUseCase implements IBaseUseCase {
  constructor(
    @Inject('ITrainingTypeRepository')
    private readonly trainingTypeRepository: ITrainingTypeRepository,
  ) {}

  async execute(uuid: string): Promise<void> {
    const trainingType = await this.trainingTypeRepository.findByUuid(uuid);
    if (!trainingType) {
      throw new NotFoundException({
        title: 'Não foi possível encontrar o Tipo de Treino.',
        description: 'Verifique e tente novamente.',
      });
    }
    trainingType.toggleIsEnabled();
    await this.trainingTypeRepository.update(trainingType);
  }
}
