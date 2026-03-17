import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IBaseUseCase } from 'src/app/shared';
import type { ITrainingPlanningRepository } from '../repositories';

@Injectable()
export class FinishTrainingPlanningUseCase implements IBaseUseCase {
  constructor(
    @Inject('ITrainingPlanningRepository')
    private readonly trainingPlanningRepository: ITrainingPlanningRepository,
  ) {}

  async execute(trainingUuid: string) {
    const training = await this.trainingPlanningRepository.findByUuid(
      trainingUuid,
    );

    if (!training)
      throw new NotFoundException({
        title: 'Planejamento de treino não encontrado!',
        message: 'Verifique e tente novamente...',
      });

    training.finish();

    await this.trainingPlanningRepository.update(training);
  }
}
