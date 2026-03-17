import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  UpdateWeekLoadUseCase,
  type IMonitoryRepository,
} from '../../monitory';
import type { IBaseUseCase } from 'src/app/shared';
import type { ITrainingRepository } from '../repositories';

@Injectable()
export class DeleteTrainingUseCase
  extends UpdateWeekLoadUseCase
  implements IBaseUseCase
{
  constructor(
    @Inject('ITrainingRepository')
    private readonly trainingRepository: ITrainingRepository,
    @Inject('IMonitoryRepository')
    private readonly _: IMonitoryRepository,
  ) {
    super(_, trainingRepository);
  }

  async execute(uuid: string): Promise<void> {
    const training = await this.trainingRepository.findByUuid(uuid);

    if (!training)
      throw new NotFoundException({
        title: 'Treino não encontrado!',
        message: 'Verifique e tente novamente...',
      });

    await this.trainingRepository.delete(uuid);

    await this.updateWeekLoad({
      athleteId: training.getAthleteId(),
      date: training.getDate(),
    });
  }
}
