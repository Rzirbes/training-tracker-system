import { Injectable } from '@nestjs/common';
import { PrismaPGService } from '../prisma-pg.service';
import { TokenEntity } from 'src/app/modules/auth';
import type { IUnsubscribeRepository } from 'src/app/modules/unsubscribe';

@Injectable()
export class UnsubscribePostgresRepository implements IUnsubscribeRepository {
  constructor(private readonly prismaService: PrismaPGService) {}

  async findToken(token: string): Promise<TokenEntity | null> {
    const result = await this.prismaService.token.findFirst({
      where: { token },
    });
    if (!result) return null;
    return new TokenEntity({
      ...result,
      type: result.type as TokenEntity['type'],
    });
  }

  async saveEmail(email: string): Promise<void> {
    await this.prismaService.unsubscribes.create({
      data: { email },
    });
  }

  async findEmails(): Promise<string[]> {
    const data = await this.prismaService.unsubscribes.findMany({
      select: { email: true },
    });
    return data.map(({ email }) => email);
  }

  async findByEmail(email: string): Promise<boolean> {
    const data = await this.prismaService.unsubscribes.findUnique({
      where: { email },
    });
    return !!data;
  }
}
