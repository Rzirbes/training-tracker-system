import { Inject, Injectable } from '@nestjs/common';
import { chunkArray, MailQueueEnum, type IBaseUseCase } from 'src/app/shared';
import type { IQueueRepository } from '../../queues';
import type { IScheduleRepository } from '../repositories';

@Injectable()
export class SendScheduleNotificationToAthletesUseCase implements IBaseUseCase {
  constructor(
    @Inject('IScheduleRepository')
    private readonly scheduleRepository: IScheduleRepository,
    @Inject('IQueueRepository')
    private readonly queueRepository: IQueueRepository,
  ) {}

  async execute(): Promise<void> {
    const date = this.getDayTimeRange();

    const schedules = await this.scheduleRepository.find({
      start: date.start,
      end: date.end,
    });

    if (!schedules.length) return;

    const messages = schedules.reduce((acc, schedule) => {
      const athlete = schedule.getAthlete();
      const coach = schedule.getCoach();

      acc.push({
        token: schedule.getUuid(),
        name: athlete.getName(),
        email: athlete.getEmail(),
        type: MailQueueEnum.CREATE_SCHEDULE,
        schedule: {
          coach: coach.getName(),
          date: schedule
            .getStart()
            .toLocaleDateString('pt-BR', { dateStyle: 'full' }),
          time: {
            start: schedule.getStart().toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
            }),
            end: schedule.getEnd().toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
            }),
          },
        },
      });

      return acc;
    }, []);

    const chunkedMessages = chunkArray(messages);

    for (const chunk of chunkedMessages) {
      await this.queueRepository.sendBatchMailToQueue(chunk);
    }
  }

  private getDayTimeRange() {
    const today = new Date();

    const start = new Date(today);
    start.setHours(0, 0, 0, 0);

    const end = new Date(today);
    end.setHours(23, 59, 59, 999);

    return { start, end };
  }
}
