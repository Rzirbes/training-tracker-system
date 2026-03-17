import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FindTrainingResponseDto } from '../dtos';
import type { IBaseUseCase } from 'src/app/shared';
import type { ITrainingRepository } from '../repositories';

@Injectable()
export class FindTrainingUseCase implements IBaseUseCase {
  constructor(
    @Inject('ITrainingRepository')
    private readonly trainingRepository: ITrainingRepository,
  ) {}

  async execute(uuid: string): Promise<FindTrainingResponseDto> {
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
      psr: training.getPSR(),
      pains: training
        .getPains()
        .map((entity) =>
          Object.assign({ uuid: entity.getUuid() }, entity.toJSON()),
        ),
      injuries: training
        .getInjuries()
        .map((entity) =>
          Object.assign({ uuid: entity.getUuid() }, entity.toJSON()),
        ),
      trainingType: {
        id: training.getTrainingType().getUuid(),
        name: training.getTrainingType().getName(),
      },
    };
  }
}
