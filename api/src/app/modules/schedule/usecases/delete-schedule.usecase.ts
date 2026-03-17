import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IBaseUseCase, MailQueueEnum } from 'src/app/shared';
import { IScheduleRepository } from '../repositories';
import { IQueueRepository } from '../../queues';

@Injectable()
export class DeleteScheduleUseCase implements IBaseUseCase {
  constructor(
    @Inject('IScheduleRepository')
    private readonly scheduleRepository: IScheduleRepository,
  ) // @Inject('IQueueRepository')
  // private readonly queueRepository: IQueueRepository,
  {}
  public async execute(id: string) {
    const { schedule } = await this.validateSchedule(id);

    await this.scheduleRepository.delete(schedule);

    // const today = new Date();
    // const scheduleInPast = schedule.getStart().getTime() <= today.getTime();
    // const shouldNotification = !scheduleInPast;

    // if (shouldNotification) {
    //   await this.queueRepository.sendMailToQueue({
    //     type: MailQueueEnum.CANCEL_SCHEDULE,
    //     email: schedule.getAthlete().getEmail(),
    //     name: schedule.getAthlete().getName(),
    //     token: schedule.getUuid(),
    //     schedule: {
    //       date: schedule
    //         .getStart()
    //         .toLocaleDateString('pt-BR', { dateStyle: 'full' }),
    //       time: schedule.getStart().toLocaleTimeString('pt-BR', {
    //         hour: '2-digit',
    //         minute: '2-digit',
    //       }),
    //     },
    //   });
    // }

    return {
      title: 'Agendamento deletado!',
      // ...(shouldNotification && {
      //   message:
      //     'Enviaremos uma notificação para o atleta informando sobre o cancelamento.',
      // }),
    };
  }

  private async validateSchedule(id: string) {
    const schedule = await this.scheduleRepository.findByUuid(id);

    if (!schedule)
      throw new NotFoundException({
        title: 'Agendamento não encontrado.',
        message:
          'Não foi possível concluir a exclusão pois não encontramos o Agendamento. Verifique e tente novamente!',
      });

    return { schedule };
  }
}
