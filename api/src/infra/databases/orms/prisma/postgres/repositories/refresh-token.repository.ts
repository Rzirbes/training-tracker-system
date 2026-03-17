import { Injectable } from '@nestjs/common';
import { PrismaPGService } from '../prisma-pg.service';
import { TokenTypeEnum } from 'src/app/shared';
import {
  TokenEntity,
  type IRefreshTokenRepository,
} from 'src/app/modules/auth';

@Injectable()
export class RefreshTokenPostgresRepository implements IRefreshTokenRepository {
  constructor(private readonly prismaService: PrismaPGService) {}

  async invalidateTokensByUserId(id: number): Promise<void> {
    await this.prismaService.token.updateMany({
      where: {
        user: { id },
        type: {
          in: [TokenTypeEnum.RECOVERY, TokenTypeEnum.REFRESH],
        },
      },
      data: {
        isValid: false,
      },
    });
  }

  async findByToken(refreshToken: string): Promise<TokenEntity> {
    const token = await this.prismaService.token.findFirst({
      where: { token: refreshToken },
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
}
