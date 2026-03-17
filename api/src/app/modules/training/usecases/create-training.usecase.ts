import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrainingDto } from '../dtos';
import { TrainingEntity } from '../entities';
import {
  UpdateWeekLoadUseCase,
  type IMonitoryRepository,
} from '../../monitory';
import { ITrainingPlanningRepository } from '../../training-planning';
import { IScheduleRepository } from '../../schedule/repositories';
import { InjuryEntity } from '../../injury/entities';
import { PainEntity } from '../../pain/entities';
import type { ITrainingRepository } from '../repositories';
import type { IAthleteRepository } from '../../athlete';
import type { ITrainingTypeRepository } from '../../training-type';
import type { IBaseUseCase } from 'src/app/shared';

@Injectable()
export class CreateTrainingUseCase
  extends UpdateWeekLoadUseCase
  implements IBaseUseCase
{
  constructor(
    @Inject('IAthleteRepository')
    private readonly athleteRepository: IAthleteRepository,
    @Inject('ITrainingTypeRepository')
    private readonly trainingTypeRepository: ITrainingTypeRepository,
    @Inject('ITrainingRepository')
    private readonly trainingRepository: ITrainingRepository,
    @Inject('ITrainingPlanningRepository')
    private readonly trainingPlanningRepository: ITrainingPlanningRepository,
    @Inject('IScheduleRepository')
    private readonly scheduleRepository: IScheduleRepository,
    @Inject('IMonitoryRepository')
    private readonly _: IMonitoryRepository,
  ) {
    super(_, trainingRepository);
  }

  async execute(input: CreateTrainingDto) {
    const {
      athleteUuid,
      trainingTypeUuid,
      date,
      duration,
      pse,
      psr,
      description,
      trainingPlanningUuid,
      injuries,
      pains,
    } = input;

    const { athlete, trainingType, trainingPlanning } =
      await this.validateEntities(
        athleteUuid,
        trainingTypeUuid,
        trainingPlanningUuid,
      );

    const athleteId = athlete.getId();
    const trainingTypeId = trainingType.getId();

    const training = new TrainingEntity({
      date,
      duration,
      pse,
      psr,
      description,
      athleteId,
      trainingTypeId,
      injuries: injuries.map(
        (data) => new InjuryEntity({ ...data, athleteId }),
      ),
      pains: pains.map((data) => new PainEntity({ ...data, athleteId })),
    });

    const createdTraining = await this.trainingRepository.create(training);

    if (trainingPlanning) {
      trainingPlanning.finish();
      await this.trainingPlanningRepository.update(trainingPlanning);
      const schedule = trainingPlanning.getSchedule();
      if (schedule) {
        schedule.finish(createdTraining.uuid);
        await this.scheduleRepository.finish(schedule);
      }
    }

    await this.updateWeekLoad({
      athleteId,
      date,
    });
  }

  private async validateEntities(
    athleteUuid: string,
    trainingTypeUuid: string,
    trainingPlanningUuid: string,
  ) {
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

    const trainingPlanning = trainingPlanningUuid
      ? await this.trainingPlanningRepository.findByUuid(trainingPlanningUuid, {
          include: {
            schedule: true,
          },
        })
      : null;

    if (trainingPlanningUuid && !trainingPlanning)
      throw new NotFoundException({
        title: 'Planejamento de Treino não encontrado!',
        message: 'Verifique e tente novamente...',
      });

    return { athlete, trainingType, trainingPlanning };
  }
}
