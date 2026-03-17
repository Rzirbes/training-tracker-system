import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  MailQueueEnum,
  TokenTypeEnum,
  type IBaseUseCase,
} from 'src/app/shared';
import { TokenEntity } from '../entities';
import type { IRecoveryTokenRepository } from '../repositories';
import type { IUserRepository } from '../../user/';
import type { IQueueRepository } from '../../queues';
import { ForgotPasswordDto } from '../dtos';

@Injectable()
export class ForgotPasswordUseCase implements IBaseUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IRecoveryTokenRepository')
    private readonly tokenRepository: IRecoveryTokenRepository,
    @Inject('IQueueRepository')
    private readonly queueRepository: IQueueRepository,
  ) {}

  public async execute({ email }: ForgotPasswordDto): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException({
        title: 'Usuário não encontrado.',
        message: 'Verifique o e-mail e tente novamente...',
      });
    }
    const token = await this.createToken(user.getId());
    await this.queueRepository.sendMailToQueue({
      email,
      name: user.getName(),
      token: token.getToken(),
      type: MailQueueEnum.RECOVERY,
    });
  }

  private async createToken(userId: number) {
    const tokenEntity = new TokenEntity({
      userId,
      isValid: true,
      type: TokenTypeEnum.RECOVERY,
    });
    await this.tokenRepository.invalidateTokensByUserId(userId);
    return await this.tokenRepository.save(tokenEntity);
  }
}
