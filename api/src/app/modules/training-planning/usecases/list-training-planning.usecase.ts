import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  ListTrainingPlanningRequestDto,
  ListTrainingPlanningResponseDto,
} from '../dtos';
import { TrainingPlanningEntity } from '../entities';
import type { IBaseUseCase } from 'src/app/shared';
import type { ITrainingPlanningRepository } from '../repositories';
import type { IAthleteRepository } from '../../athlete';

@Injectable()
export class ListTrainingPlanningUseCase implements IBaseUseCase {
  constructor(
    @Inject('IAthleteRepository')
    private readonly athleteRepository: IAthleteRepository,
    @Inject('ITrainingPlanningRepository')
    private readonly trainingPlanningRepository: ITrainingPlanningRepository,
  ) {}

  async execute(
    input: ListTrainingPlanningRequestDto,
  ): Promise<ListTrainingPlanningResponseDto> {
    const { athleteUuid } = input;
    const athlete = await this.athleteRepository.findByUuid(athleteUuid);

    if (!athlete)
      throw new NotFoundException({
        title: 'Atleta não encontrado!',
        message: 'Verifique e tente novamente...',
      });

    const startDate = new Date(input.startDate);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(input.endDate);
    endDate.setHours(23, 59, 59, 59);

    const [
      trainingPlanning,
      previousWeekTrainingPlanning,
      nextWeekTrainingPlanning,
    ] = await Promise.all([
      this.trainingPlanningRepository.find({
        startDate,
        endDate,
        athleteId: athlete.getId(),
      }),
      this.trainingPlanningRepository.find({
        startDate: this.getPreviousWeekDate(new Date(startDate)),
        endDate: this.getPreviousWeekDate(new Date(endDate)),
        athleteId: athlete.getId(),
      }),
      this.trainingPlanningRepository.find({
        startDate: this.getNextWeekDate(new Date(startDate)),
        endDate: this.getNextWeekDate(new Date(endDate)),
        athleteId: athlete.getId(),
      }),
    ]);

    return {
      trainingPlanning: trainingPlanning.map((planning) => ({
        id: planning.getUuid(),
        date: planning.getDate(),
        duration: planning.getDuration(),
        pse: planning.getPSE(),
        finished: planning.getFinished(),
        trainingType: {
          id: planning.getTrainingType().getUuid(),
          name: planning.getTrainingType().getName(),
        },
        description: planning.getDescription(),
        load: planning.getLoad(),
      })),
      charge: {
        week: this.getWeekCharge(trainingPlanning),
        previousWeek: this.getWeekCharge(previousWeekTrainingPlanning),
        nextWeek: this.getWeekCharge(nextWeekTrainingPlanning),
      },
      trainingTotals: {
        week: trainingPlanning.length,
        previousWeek: previousWeekTrainingPlanning.length,
        nextWeek: nextWeekTrainingPlanning.length,
      },
    };
  }

  private getWeekCharge(trainings: TrainingPlanningEntity[]): number {
    return trainings.reduce((acc, training) => {
      const charge = training.getDuration() * training.getPSE();
      return (acc += charge);
    }, 0);
  }

  private getPreviousWeekDate(date: Date): Date {
    const previousWeekDate = new Date(date);
    previousWeekDate.setDate(date.getDate() - 7);
    return previousWeekDate;
  }

  private getNextWeekDate(date: Date): Date {
    const nextWeekDate = new Date(date);
    nextWeekDate.setDate(date.getDate() + 7);
    return nextWeekDate;
  }
}
