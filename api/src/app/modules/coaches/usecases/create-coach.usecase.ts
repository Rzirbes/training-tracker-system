import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  MailQueueEnum,
  TokenTypeEnum,
  type IBaseUseCase,
} from 'src/app/shared';
import { CreateCoachDto } from '../dtos';
import { CoachEntity } from '../entities';
import {
  TokenEntity,
  type IRecoveryTokenRepository,
  type ISecurityRepository,
} from '../../auth';
import type { IQueueRepository } from '../../queues';
import type { ICoachRepository } from '../repositories';

@Injectable()
export class CreateCoachUseCase implements IBaseUseCase {
  constructor(
    @Inject('ICoachRepository')
    private readonly coachRepository: ICoachRepository,
    @Inject('IQueueRepository')
    private readonly queueRepository: IQueueRepository,
    @Inject('ISecurityRepository')
    private readonly securityRepository: ISecurityRepository,
    @Inject('IRecoveryTokenRepository')
    private readonly tokenRepository: IRecoveryTokenRepository,
  ) {}

  async execute(data: CreateCoachDto): Promise<void> {
    await this.validateEmailUniqueness(data.email);

    const coach = new CoachEntity(data);
    coach.buildUser(await this.generatePassword());

    const { userId } = await this.coachRepository.create(coach);

    try {
      await this.notification(userId, data.name, data.email);
    } catch (err) {
      console.warn('Falha ao enviar e-mail/fila:', err?.message ?? err);
    }
  }

  private async validateEmailUniqueness(email: string): Promise<void> {
    const existingUser = await this.coachRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictException({
        title: 'Não foi possível criar o colaborador!',
        message: 'Email do usuário já existe, verifique e tente novamente',
      });
    }
  }

  private async generatePassword() {
    return await this.securityRepository.hashPassword(randomUUID());
  }

  private async createToken(userId: number) {
    const tokenEntity = new TokenEntity({
      userId,
      isValid: true,
      type: TokenTypeEnum.RECOVERY,
    });
    return await this.tokenRepository.save(tokenEntity);
  }

  private async notification(userId: number, name: string, email: string) {
    const token = await this.createToken(userId);
    await this.queueRepository.sendMailToQueue({
      name,
      email,
      token: token.getToken(),
      type: MailQueueEnum.CREATE_USER,
    });
  }
}
