import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { ITrainingPlanningRepository } from '../repositories';
import type { IBaseUseCase } from 'src/app/shared';

@Injectable()
export class DeleteTrainingPlanningUseCase implements IBaseUseCase {
  constructor(
    @Inject('ITrainingPlanningRepository')
    private readonly trainingPlanningRepository: ITrainingPlanningRepository,
  ) {}

  async execute(uuid: string) {
    const training = await this.trainingPlanningRepository.findByUuid(uuid);

    if (!training)
      throw new NotFoundException({
        title: 'Planejamento de treino não encontrado!',
        message: 'Verifique e tente novamente...',
      });

    await this.trainingPlanningRepository.delete(uuid);
  }
}
