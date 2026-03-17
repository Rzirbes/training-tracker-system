import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  getFirstAndLastDayOfWeek,
  getLastFourWeeksFromDate,
} from 'src/app/shared';
import { UpdateWeekLoadDto } from '../dtos';
import { MonitoryEntity } from '../entities';
import type { IMonitoryRepository } from '../repositories';
import type { ITrainingRepository } from '../../training';

@Injectable()
export class UpdateWeekLoadUseCase {
  constructor(
    @Inject('IMonitoryRepository')
    private readonly injectMonitoryRepository: IMonitoryRepository,
    @Inject('ITrainingRepository')
    private readonly injectTrainingRepository: ITrainingRepository,
  ) {}

  public async updateWeekLoad({ athleteId, date }: UpdateWeekLoadDto) {
    try {
      const { firstDay, lastDay, week } = getFirstAndLastDayOfWeek(
        new Date(date),
      );

      const previousWeekDates = getLastFourWeeksFromDate(date);

      const dates = { startDate: firstDay, endDate: lastDay };

      const [weekMonitory, ...previousWeeksMonitory] =
        await this.injectMonitoryRepository.findWeeks(athleteId, [
          week,
          ...previousWeekDates,
        ]);

      const weekTrainings = await this.injectTrainingRepository.find({
        athleteId,
        ...dates,
      });

      weekMonitory.calculate(weekTrainings, previousWeeksMonitory);

      await this.injectMonitoryRepository.upsertWeekLoad(weekMonitory);
    } catch (error) {
      throw new BadRequestException({
        title: 'Erro ao atualizar a carga semanal!',
        message: 'Verifique e tente novamente...',
      });
    }
  }
}
