import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ListTrainingRequestDto, ListTrainingResponseDto } from '../dtos';
import { TrainingEntity } from '../entities';
import type { IBaseUseCase } from 'src/app/shared';
import type { ITrainingRepository } from '../repositories';
import type { IAthleteRepository } from '../../athlete';

@Injectable()
export class ListTrainingUseCase implements IBaseUseCase {
  constructor(
    @Inject('IAthleteRepository')
    private readonly athleteRepository: IAthleteRepository,
    @Inject('ITrainingRepository')
    private readonly trainingRepository: ITrainingRepository,
  ) {}

  async execute(
    input: ListTrainingRequestDto,
  ): Promise<ListTrainingResponseDto> {
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

    const [trainings, previousWeekTraining, nextWeekTraining] =
      await Promise.all([
        this.trainingRepository.find({
          startDate,
          endDate,
          athleteId: athlete.getId(),
        }),
        this.trainingRepository.find({
          startDate: this.getPreviousWeekDate(new Date(startDate)),
          endDate: this.getPreviousWeekDate(new Date(endDate)),
          athleteId: athlete.getId(),
        }),
        this.trainingRepository.find({
          startDate: this.getNextWeekDate(new Date(startDate)),
          endDate: this.getNextWeekDate(new Date(endDate)),
          athleteId: athlete.getId(),
        }),
      ]);

    return {
      trainings: trainings.map((training) => ({
        id: training.getUuid(),
        date: training.getDate(),
        duration: training.getDuration(),
        pse: training.getPSE(),
        psr: training.getPSR(),
        trainingType: {
          id: training.getTrainingType().getUuid(),
          name: training.getTrainingType().getName(),
        },
        description: training.getDescription(),
        load: training.getLoad(),
      })),
      charge: {
        week: this.getWeekCharge(trainings),
        previousWeek: this.getWeekCharge(previousWeekTraining),
        nextWeek: this.getWeekCharge(nextWeekTraining),
      },
      trainingTotals: {
        week: trainings.length,
        previousWeek: previousWeekTraining.length,
        nextWeek: nextWeekTraining.length,
      },
    };
  }

  private getWeekCharge(trainings: TrainingEntity[]): number {
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
