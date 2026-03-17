import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateTrainingPlanningDto } from '../dtos';
import { TrainingPlanningEntity } from '../entities';
import type { ITrainingPlanningRepository } from '../repositories';
import type { ITrainingTypeRepository } from '../../training-type';
import type { IBaseUseCase } from 'src/app/shared';

@Injectable()
export class UpdateTrainingPlanningUseCase implements IBaseUseCase {
  constructor(
    @Inject('ITrainingTypeRepository')
    private readonly trainingTypeRepository: ITrainingTypeRepository,
    @Inject('ITrainingPlanningRepository')
    private readonly trainingPlanningRepository: ITrainingPlanningRepository,
  ) {}

  async execute(input: UpdateTrainingPlanningDto) {
    const { trainingUuid, trainingTypeUuid, date, duration, pse, description } =
      input;

    const training = await this.trainingPlanningRepository.findByUuid(
      trainingUuid,
    );

    if (!training)
      throw new NotFoundException({
        title: 'Planejamento de treino não encontrado!',
        message: 'Verifique e tente novamente...',
      });

    await this.validateTrainingType(training, trainingTypeUuid);

    training.update({
      date,
      duration,
      pse,
      description,
    });

    await this.trainingPlanningRepository.update(training);
  }

  private async validateTrainingType(
    training: TrainingPlanningEntity,
    trainingTypeUuid: string,
  ) {
    if (trainingTypeUuid !== training.getTrainingType().getUuid()) {
      const trainingType = await this.trainingTypeRepository.findByUuid(
        trainingTypeUuid,
      );

      if (!trainingType)
        throw new NotFoundException({
          title: 'Tipo de Treino não encontrado!',
          message: 'Verifique e tente novamente...',
        });

      training.updateTrainingTypeId(trainingType.getId());
    }
  }
}
