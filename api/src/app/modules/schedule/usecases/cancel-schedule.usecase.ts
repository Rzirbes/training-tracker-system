import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IBaseUseCase, MailQueueEnum } from 'src/app/shared';
import { IScheduleRepository } from '../repositories';
import { IQueueRepository } from '../../queues';
import { ScheduleEntity } from '../entities';

@Injectable()
export class CancelScheduleUseCase implements IBaseUseCase {
  constructor(
    @Inject('IScheduleRepository')
    private readonly scheduleRepository: IScheduleRepository,
    @Inject('IQueueRepository')
    private readonly queueRepository: IQueueRepository,
  ) {}
  public async execute(id: string) {
    const { schedule } = await this.validateSchedule(id);

    schedule.cancel();

    await this.scheduleRepository.cancel(schedule);

    const shouldNotification = await this.notification(schedule);

    return {
      title: 'Agendamento cancelado!',
      ...(shouldNotification && {
        message:
          'Enviaremos uma notificação para o atleta informando sobre o cancelamento.',
      }),
    };
  }

  private async validateSchedule(id: string) {
    const schedule = await this.scheduleRepository.findByUuid(id);

    if (!schedule)
      throw new NotFoundException({
        title: 'Agendamento não encontrado.',
        message:
          'Não foi possível concluir o cancelamento pois não encontramos o Agendamento. Verifique e tente novamente!',
      });

    return { schedule };
  }

  private async notification(schedule: ScheduleEntity) {
    const now = new Date();

    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const startDate = schedule.getStart();

    const shouldNotification =
      startDate.getTime() >= now.getTime() &&
      startDate.getTime() <= endOfDay.getTime();

    if (shouldNotification) {
      await this.queueRepository.sendMailToQueue({
        type: MailQueueEnum.CANCEL_SCHEDULE,
        email: schedule.getAthlete().getEmail(),
        name: schedule.getAthlete().getName(),
        token: schedule.getUuid(),
        schedule: {
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
    }

    return shouldNotification;
  }
}
