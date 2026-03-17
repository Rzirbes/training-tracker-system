import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ICronRepository } from './cron.repository';
import { SendWellBeingToAthletesUseCase } from '../monitory/usecases';
import { SendScheduleNotificationToAthletesUseCase } from '../schedule/usecases';

const EVERY_DAY_AT_5_15AM = '0 15 5 * * *';

@Injectable()
export class NestjsSchedulerRepository implements ICronRepository {
  constructor(
    private readonly sendWellBeingToAthletesUseCase: SendWellBeingToAthletesUseCase,
    private readonly sendScheduleNotificationToAthletesUseCase: SendScheduleNotificationToAthletesUseCase,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_5AM)
  public async sendWellBeingMonitory(): Promise<void> {
    try {
      await this.sendWellBeingToAthletesUseCase.execute();
      console.log(
        'Mensagens de monitoramento diário dos atletas publicadas na fila!',
      );
    } catch (error) {
      console.log(
        'Falha ao publicar monitoramento diário dos atletas na fila!',
        error,
      );
      throw new Error(
        'Falha ao publicar monitoramento diário dos atletas na fila!',
      );
    }
  }

  @Cron(EVERY_DAY_AT_5_15AM)
  public async sendScheduleNotification(): Promise<void> {
    try {
      await this.sendScheduleNotificationToAthletesUseCase.execute();
      console.log('Mensagens de treinamentos agendados publicadas na fila!');
    } catch (error) {
      console.log('Falha ao publicar treinamentos agendados na fila!', error);
      throw new Error('Falha ao publicar treinamentos agendados na fila!');
    }
  }
}
