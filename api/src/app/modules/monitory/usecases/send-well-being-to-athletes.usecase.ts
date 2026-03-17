import { Inject, Injectable } from '@nestjs/common';
import { TokenEntity } from '../../auth';
import {
  chunkArray,
  MailQueueEnum,
  TokenTypeEnum,
  type IBaseUseCase,
} from 'src/app/shared';
import type { IAthleteRepository } from '../../athlete';
import type { IQueueRepository } from '../../queues';
import type { IMonitoryTokenRepository } from '../repositories';
import type { IUnsubscribeRepository } from '../../unsubscribe';

@Injectable()
export class SendWellBeingToAthletesUseCase implements IBaseUseCase {
  constructor(
    @Inject('IAthleteRepository')
    private readonly athleteRepository: IAthleteRepository,
    @Inject('IQueueRepository')
    private readonly queueRepository: IQueueRepository,
    @Inject('IMonitoryTokenRepository')
    private readonly monitoryTokenRepository: IMonitoryTokenRepository,
    @Inject('IUnsubscribeRepository')
    private readonly unsubscribeRepository: IUnsubscribeRepository,
  ) {}

  async execute(): Promise<void> {
    const today = new Date();
    const unsubscribes = await this.unsubscribeRepository.findEmails();

    const athletes =
      await this.athleteRepository.searchByDayWithPlanningOrDailyMonitor({
        day: today,
        not: { emails: unsubscribes },
      });

    if (!athletes.length) return;

    const { messages, tokens } = athletes.reduce(
      (acc, athlete) => {
        const token = new TokenEntity({
          userId: athlete.getId(),
          type: TokenTypeEnum.MONITORY,
        });

        const message = {
          email: athlete.getEmail(),
          name: athlete.getName(),
          token: token.getToken(),
          type: MailQueueEnum.MONITORY,
        };

        acc.tokens.push(token);
        acc.messages.push(message);

        return acc;
      },
      {
        tokens: [] as TokenEntity[],
        messages: [] as {
          email: string;
          name: string;
          token: string;
          type: MailQueueEnum;
        }[],
      },
    );

    await this.monitoryTokenRepository.saveBatch(tokens);

    const chunkedMessages = chunkArray(messages);

    for (const chunk of chunkedMessages) {
      await this.queueRepository.sendBatchMailToQueue(chunk);
    }
  }
}
