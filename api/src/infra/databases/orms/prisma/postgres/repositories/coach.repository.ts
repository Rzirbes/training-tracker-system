import { Injectable } from '@nestjs/common';
import { PrismaPGService } from '../prisma-pg.service';
import { CoachEntity } from 'src/app/modules/coaches/entities';
import {
  FindCoachByUuidQuery,
  GetCoachesRequestDto,
} from 'src/app/modules/coaches/dtos';
import { CoachAdapter } from '../adapters';
import type { ICoachRepository } from 'src/app/modules/coaches/repositories';
import { SortDirectionEnum } from 'src/app/shared';

@Injectable()
export class CoachPostgresRepository implements ICoachRepository {
  constructor(private readonly prismaService: PrismaPGService) {}

  public async create(
    coach: CoachEntity,
  ): Promise<{ id: number; userId: number }> {
    try {
      const data = CoachAdapter.create(coach);
      const { id, userId } = await this.prismaService.coach.create({
        data,
      });
      return { id, userId };
    } catch (err) {
      throw new Error('Não foi possível criar o treinador no banco de dados.');
    }
  }

  public async findByEmail(email: string): Promise<CoachEntity | null> {
    const coach = await this.prismaService.coach.findUnique({
      where: { email },
    });
    if (!coach) return null;
    return new CoachEntity(coach);
  }

  public async findByUuid(
    uuid: string,
    query?: FindCoachByUuidQuery,
  ): Promise<CoachEntity | null> {
    const coach = await this.prismaService.coach.findUnique({
      where: { uuid },
      include: {
        ...(query?.include?.address && {
          address: { include: { state: true, city: true, country: true } },
        }),
      },
    });
    if (!coach) return null;
    return CoachAdapter.find(coach);
  }

  public async update(coach: CoachEntity): Promise<void> {
    try {
      const data = CoachAdapter.update(coach);
      await this.prismaService.coach.update({
        where: { id: coach.getId() },
        data,
      });
    } catch (err) {
      throw new Error(
        'Não foi possível atualizar o treinador no banco de dados.',
      );
    }
  }

  async updateStatus(coach: CoachEntity) {
    try {
      const isEnabled = coach.getIsEnabled();

      await this.prismaService.coach.update({
        where: { id: coach.getId() },
        data: {
          isEnabled,
          user: {
            update: {
              isEnabled,
            },
          },
        },
      });
    } catch (err) {
      throw new Error(
        'Não foi possível atualizar o status do treinador no banco de dados.',
      );
    }
  }

  async findAll({
    page = 1,
    size = 10,
    search,
    isEnabled,
  }: GetCoachesRequestDto): Promise<CoachEntity[]> {
    const coaches = await this.prismaService.coach.findMany({
      take: size,
      skip: (page - 1) * size,
      where: {
        isEnabled,
        ...(search && {
          OR: [
            {
              name: { contains: search, mode: 'insensitive' },
            },
            {
              email: { contains: search, mode: 'insensitive' },
            },
          ],
        }),
      },
      orderBy: {
        name: SortDirectionEnum.ASC,
      },
    });

    return coaches.map((coach) => new CoachEntity(coach));
  }

  async count({
    search,
  }: Pick<GetCoachesRequestDto, 'search'>): Promise<number> {
    return this.prismaService.coach.count({
      where: {
        ...(search && {
          OR: [
            {
              name: { contains: search, mode: 'insensitive' },
            },
            {
              email: { contains: search, mode: 'insensitive' },
            },
          ],
        }),
      },
    });
  }
}
