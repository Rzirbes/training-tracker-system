import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { WeekMonitoringRequestDto, WeekMonitoringResponseDto } from '../dtos';
import {
  TrainingPlanningEntity,
  type ITrainingPlanningRepository,
} from '../../training-planning';
import type { IAthleteRepository } from '../../athlete';
import type { ITrainingRepository, TrainingEntity } from '../../training';
import type { IBaseUseCase } from 'src/app/shared';

interface TrainingData {
  performed: number[];
  planned: number[];
}

@Injectable()
export class GetWeekMonitoringUseCase implements IBaseUseCase {
  constructor(
    @Inject('IAthleteRepository')
    private readonly athleteRepository: IAthleteRepository,
    @Inject('ITrainingRepository')
    private readonly trainingRepository: ITrainingRepository,
    @Inject('ITrainingPlanningRepository')
    private readonly trainingPlanningRepository: ITrainingPlanningRepository,
  ) {}

  public async execute(
    input: WeekMonitoringRequestDto,
  ): Promise<WeekMonitoringResponseDto> {
    const { athleteUuid, startDate: startStr, endDate: endStr } = input;
    const athlete = await this.athleteRepository.findByUuid(athleteUuid);

    if (!athlete)
      throw new NotFoundException({
        title: 'Atleta não encontrado!',
        message: 'Verifique e tente novamente...',
      });

    const startDate = new Date(startStr);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(endStr);
    endDate.setHours(23, 59, 59, 59);

    const days = this.generateDays(startDate, endDate);

    const { trainings, durations, PSEs, PSRs, trainingCounts } =
      this.generateDefaultValuesByDays(days);

    const performedTrainings = await this.trainingRepository.find({
      startDate,
      endDate,
      athleteId: athlete.getId(),
    });

    this.accumulateTrainingData(
      performedTrainings,
      days,
      trainings,
      durations,
      PSEs,
      PSRs,
      trainingCounts,
      'performed',
    );

    const plannedTrainings = await this.trainingPlanningRepository.find({
      startDate,
      endDate,
      athleteId: athlete.getId(),
    });

    this.accumulateTrainingData(
      plannedTrainings,
      days,
      trainings,
      durations,
      PSEs,
      PSRs,
      trainingCounts,
      'planned',
    );

    this.calculateAverages(PSEs, PSRs, trainingCounts);

    return {
      days,
      trainings,
      durations,
      PSEs,
      PSRs,
    };
  }

  private generateDays(startDate: Date, endDate: Date): Date[] {
    const dates: Date[] = [];
    const currentDate: Date = new Date(startDate);

    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  }

  private getDayIndex(date: Date, days: Date[]): number {
    for (let i = 0; i < days.length; i++) {
      if (
        date.getFullYear() === days[i].getFullYear() &&
        date.getMonth() === days[i].getMonth() &&
        date.getDate() === days[i].getDate()
      ) {
        return i;
      }
    }
    return -1;
  }

  private generateDefaultValuesByDays(days: Date[]): {
    trainings: TrainingData;
    durations: TrainingData;
    PSEs: TrainingData;
    PSRs: number[];
    trainingCounts: TrainingData;
  } {
    const defaultValues: number[] = new Array(days.length).fill(0);
    const trainings: TrainingData = {
      performed: [...defaultValues],
      planned: [...defaultValues],
    };

    const durations: TrainingData = {
      performed: [...defaultValues],
      planned: [...defaultValues],
    };

    const PSEs: TrainingData = {
      performed: [...defaultValues],
      planned: [...defaultValues],
    };

    const PSRs: number[] = [...defaultValues];

    const trainingCounts: TrainingData = {
      performed: [...defaultValues],
      planned: [...defaultValues],
    };

    return { trainings, durations, PSEs, PSRs, trainingCounts };
  }

  private accumulateTrainingData(
    trainings: TrainingEntity[] | TrainingPlanningEntity[],
    days: Date[],
    accumulatedTrainings: TrainingData,
    durations: TrainingData,
    PSEs: TrainingData,
    PSRs: number[],
    trainingCounts: TrainingData,
    type: 'performed' | 'planned',
  ): void {
    trainings.forEach((training) => {
      const trainingDate = new Date(training.getDate());
      const index = this.getDayIndex(trainingDate, days);

      if (index !== -1) {
        if (type === 'performed') {
          PSRs[index] += training.getPSR();
          durations.performed[index] += training.getDuration();
          accumulatedTrainings.performed[index] += training.getLoad();
          PSEs.performed[index] += training.getPSE();
          trainingCounts.performed[index]++;
        } else if (type === 'planned') {
          durations.planned[index] += training.getDuration();
          accumulatedTrainings.planned[index] += training.getLoad();
          PSEs.planned[index] += training.getPSE();
          trainingCounts.planned[index]++;
        }
      }
    });
  }

  private calculateAverages(
    PSEs: TrainingData,
    PSRs: number[],
    trainingCounts: TrainingData,
  ): void {
    for (let i = 0; i < PSRs.length; i++) {
      if (trainingCounts.performed[i] > 0) {
        (PSRs[i] = this.formatNumber(PSRs[i] / trainingCounts.performed[i])),
          (PSEs.performed[i] = this.formatNumber(
            PSEs.performed[i] / trainingCounts.performed[i],
          ));
      }

      if (trainingCounts.planned[i] > 0) {
        PSEs.planned[i] = this.formatNumber(
          PSEs.planned[i] / trainingCounts.planned[i],
        );
      }
    }
  }

  private formatNumber(value: number): number {
    return parseFloat(value.toFixed(2));
  }
}
