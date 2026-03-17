import { Injectable } from '@nestjs/common';
import { PrismaPGService } from '../prisma-pg.service';
import { TokenTypeEnum } from 'src/app/shared';
import {
  TokenEntity,
  type IRecoveryTokenRepository,
} from 'src/app/modules/auth';

@Injectable()
export class RecoveryTokenPostgresRepository
  implements IRecoveryTokenRepository
{
  constructor(private readonly prismaService: PrismaPGService) {}

  async findByToken(recoveryToken: string): Promise<TokenEntity> {
    const token = await this.prismaService.token.findFirst({
      where: { token: recoveryToken, type: TokenTypeEnum.RECOVERY },
    });
    if (!token) return null;
    return new TokenEntity({ ...token, type: token.type as TokenTypeEnum });
  }

  async save(data: TokenEntity): Promise<TokenEntity> {
    const token = await this.prismaService.token.create({
      data: {
        token: data.getToken(),
        type: data.getType(),
        userId: data.getUserId(),
        expiresIn: data.getExpiresIn(),
      },
    });
    return new TokenEntity({ ...token, type: token.type as TokenTypeEnum });
  }

  async update(token: TokenEntity): Promise<void> {
    await this.prismaService.token.update({
      where: { id: token.getId() },
      data: {
        isValid: token.getIsValid(),
      },
    });
  }

  async invalidateTokensByUserId(id: number): Promise<void> {
    await this.prismaService.token.updateMany({
      where: {
        user: { id },
        type: {
          in: [TokenTypeEnum.RECOVERY],
        },
      },
      data: {
        isValid: false,
      },
    });
  }
}
