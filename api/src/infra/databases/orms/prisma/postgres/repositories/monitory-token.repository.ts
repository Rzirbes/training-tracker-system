import { Injectable } from '@nestjs/common';
import { PrismaPGService } from '../prisma-pg.service';
import { TokenTypeEnum } from 'src/app/shared';
import { TokenEntity } from 'src/app/modules/auth';
import type { IMonitoryTokenRepository } from 'src/app/modules/monitory';

@Injectable()
export class MonitoryTokenPostgresRepository
  implements IMonitoryTokenRepository
{
  private tokenType = TokenTypeEnum.MONITORY;

  constructor(private readonly prismaService: PrismaPGService) {}

  async findByToken(hash: string): Promise<TokenEntity> {
    const token = await this.prismaService.monitoryToken.findFirst({
      where: { token: hash, type: this.tokenType },
    });
    if (!token) return null;
    return new TokenEntity({
      ...token,
      userId: token.athleteId,
      type: token.type as TokenTypeEnum.MONITORY,
    });
  }

  async save(data: TokenEntity): Promise<TokenEntity> {
    const token = await this.prismaService.monitoryToken.create({
      data: {
        token: data.getToken(),
        type: data.getType(),
        athleteId: data.getUserId(),
        expiresIn: data.getExpiresIn(),
      },
    });
    return new TokenEntity({
      ...token,
      userId: token.athleteId,
      type: token.type as TokenTypeEnum.MONITORY,
    });
  }

  async saveBatch(tokens: TokenEntity[]): Promise<void> {
    await this.prismaService.monitoryToken.createMany({
      data: tokens.map((data) => ({
        token: data.getToken(),
        type: data.getType(),
        athleteId: data.getUserId(),
        expiresIn: data.getExpiresIn(),
      })),
    });
  }

  async update(token: TokenEntity): Promise<void> {
    await this.prismaService.monitoryToken.update({
      where: { id: token.getId() },
      data: {
        isValid: token.getIsValid(),
      },
    });
  }

  // async invalidateTokensByUserIds(ids: number[]): Promise<void> {
  //   await this.prismaService.monitoryToken.updateMany({
  //     where: {
  //       athleteId: { in: ids },
  //       type: this.tokenType,
  //     },
  //     data: {
  //       isValid: false,
  //     },
  //   });
  // }
}
