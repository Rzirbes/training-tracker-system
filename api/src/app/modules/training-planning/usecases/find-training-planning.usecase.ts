import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FindTrainingPlanningResponseDto } from '../dtos';
import type { IBaseUseCase } from 'src/app/shared';
import type { ITrainingPlanningRepository } from '../repositories';

@Injectable()
export class FindTrainingPlanningUseCase implements IBaseUseCase {
  constructor(
    @Inject('ITrainingPlanningRepository')
    private readonly trainingRepository: ITrainingPlanningRepository,
  ) {}

  async execute(uuid: string): Promise<FindTrainingPlanningResponseDto> {
    const training = await this.trainingRepository.findByUuid(uuid);

    if (!training)
      throw new NotFoundException({
        title: 'Treino não encontrado!',
        message: 'Verifique e tente novamente...',
      });

    return {
      id: training.getUuid(),
      date: training.getDate(),
      duration: training.getDuration(),
      description: training.getDescription(),
      load: training.getLoad(),
      pse: training.getPSE(),
      finished: training.getFinished(),
      trainingType: {
        id: training.getTrainingType().getUuid(),
        name: training.getTrainingType().getName(),
      },
    };
  }
}
