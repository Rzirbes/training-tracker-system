import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { WellBeingMonitoryEntity } from '../entities';
import {
  GetWellBeingMonitoringRequestDto,
  GetWellBeingMonitoringResponseDto,
} from '../dtos';
import type { IAthleteRepository } from '../../athlete';
import type { IWellBeingRepository } from '../repositories';
import type { IBaseUseCase } from 'src/app/shared';

@Injectable()
export class GetWellBeingMonitoringUseCase implements IBaseUseCase {
  constructor(
    @Inject('IWellBeingRepository')
    private readonly wellBeingRepository: IWellBeingRepository,
    @Inject('IAthleteRepository')
    private readonly athleteRepository: IAthleteRepository,
  ) {}

  public async execute(
    input: GetWellBeingMonitoringRequestDto,
  ): Promise<GetWellBeingMonitoringResponseDto> {
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

    const wellBeingCaptures = await this.wellBeingRepository.getWeekMonitoring({
      athleteUuid: athlete.getUuid(),
      startDate,
      endDate,
    });

    const response = this.distributorWellBeingsPerDay(days, wellBeingCaptures);

    return response;
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

  private generateDefaultValuesByDays(
    days: Date[],
  ): GetWellBeingMonitoringResponseDto {
    const generateValues = () => new Array(days.length).fill(0) as number[];
    const sleep: number[] = generateValues();
    const energy: number[] = generateValues();
    const pain: number[] = generateValues();
    const stress: number[] = generateValues();
    const humor: number[] = generateValues();
    const nutrition: number[] = generateValues();
    const motivation: number[] = generateValues();
    const waterIntake: number[] = generateValues();
    const sleepHours: number[] = generateValues();
    const fatigue: number[] = generateValues();
    return {
      days,
      sleep,
      energy,
      pain,
      stress,
      humor,
      nutrition,
      motivation,
      waterIntake,
      sleepHours,
      fatigue
    };
  }

  private distributorWellBeingsPerDay(
    days: Date[],
    wellBeingCaptures: WellBeingMonitoryEntity[],
  ): GetWellBeingMonitoringResponseDto {
    const defaultValues = this.generateDefaultValuesByDays(days);

    wellBeingCaptures.forEach((capture) => {
      const captureDate = new Date(capture.getDate());
      const index = this.getDayIndex(captureDate, days);

      if (index !== -1) {
        defaultValues.sleep[index] = capture.getSleep();
        defaultValues.sleepHours[index] = capture.getSleepHours();
        defaultValues.energy[index] = capture.getEnergy();
        defaultValues.pain[index] = capture.getPain();
        defaultValues.stress[index] = capture.getStress();
        defaultValues.humor[index] = capture.getHumor();
        defaultValues.nutrition[index] = capture.getNutrition();
        defaultValues.motivation[index] = capture.getMotivation();
        defaultValues.waterIntake[index] = capture.getWaterIntake();
        defaultValues.fatigue[index] = capture.getFatigue();
      }
    });

    return defaultValues;
  }
}
