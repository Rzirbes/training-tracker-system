import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrainingPlanningDto } from '../dtos';
import { TrainingPlanningEntity } from '../entities';
import type { ITrainingPlanningRepository } from '../repositories';
import type { IAthleteRepository } from '../../athlete';
import type { ITrainingTypeRepository } from '../../training-type';
import type { IBaseUseCase } from 'src/app/shared';

@Injectable()
export class CreateTrainingPlanningUseCase implements IBaseUseCase {
  constructor(
    @Inject('IAthleteRepository')
    private readonly athleteRepository: IAthleteRepository,
    @Inject('ITrainingTypeRepository')
    private readonly trainingTypeRepository: ITrainingTypeRepository,
    @Inject('ITrainingPlanningRepository')
    private readonly trainingPlanningRepository: ITrainingPlanningRepository,
  ) {}

  async execute(input: CreateTrainingPlanningDto) {
    const { athleteUuid, trainingTypeUuid, date, duration, pse, description } =
      input;

    const athlete = await this.athleteRepository.findByUuid(athleteUuid);

    if (!athlete)
      throw new NotFoundException({
        title: 'Atleta não encontrado!',
        message: 'Verifique e tente novamente...',
      });

    const trainingType = await this.trainingTypeRepository.findByUuid(
      trainingTypeUuid,
    );

    if (!trainingType)
      throw new NotFoundException({
        title: 'Tipo de Treino não encontrado!',
        message: 'Verifique e tente novamente...',
      });

    const trainingPlanning = new TrainingPlanningEntity({
      date,
      duration,
      pse,
      description,
      athleteId: athlete.getId(),
      trainingTypeId: trainingType.getId(),
    });

    await this.trainingPlanningRepository.create(trainingPlanning);
  }
}
