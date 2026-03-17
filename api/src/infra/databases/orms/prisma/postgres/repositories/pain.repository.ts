import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaPGService } from "../prisma-pg.service";
import { PainEntity } from "src/app/modules/pain/entities";
import { IPainRepository } from "src/app/modules/pain/repositories";
import { PainAdapter } from "../adapters";
import { SortDirectionEnum } from "src/app/shared";

@Injectable()
export class PainPostgresRepository implements IPainRepository {
  constructor(private readonly prismaService: PrismaPGService) {}

  public async createMany(pains: PainEntity[]): Promise<void> {
    await this.prismaService.pain.createMany({
      data: pains.map((entity) => ({
        ...entity.toJSON(),
        athleteId: entity.getAthleteId(),
        trainingId: entity.getTrainingId(),
      })),
    });
  }

  public async list(query: {
    athleteId: number;
    page: number;
    size: number;
    startDate?: Date;
    endDate?: Date;
    search?: string;
  }): Promise<PainEntity[]> {
    const { athleteId, page, size, search = '', startDate, endDate } = query;

    const where: Prisma.PainWhereInput = {
      athleteId,
    };

    if (search) {
      where.description = search;
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = startDate;
      }
      if (endDate) {
        where.date.lte = endDate;
      }
    }

    const injuries = await this.prismaService.pain.findMany({
      take: size,
      skip: (page - 1) * size,
      where,
      orderBy: {
        date: SortDirectionEnum.ASC,
      },
    });

    return injuries.map((pain) => PainAdapter.create(pain));
  }

  public async count(query: {
    athleteId: number;
    page: number;
    size: number;
    startDate?: Date;
    endDate?: Date;
    search?: string;
  }): Promise<number> {
    const { athleteId, page, size, search = '', startDate, endDate } = query;

    const where: Prisma.PainWhereInput = {
      athleteId,
    };

    if (search) {
      where.description = search;
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = startDate;
      }
      if (endDate) {
        where.date.lte = endDate;
      }
    }

    const total = await this.prismaService.pain.count({
      take: size,
      skip: (page - 1) * size,
      where,
      orderBy: {
        date: SortDirectionEnum.ASC,
      },
    });

    return total;
  }

  public async findMany(query: {
    athleteId: number;
    startDate?: Date;
    endDate?: Date;
    search?: string;
  }): Promise<PainEntity[]> {
    const { athleteId, search = '', startDate, endDate } = query;

    const where: Prisma.PainWhereInput = {
      athleteId,
    };

    if (search) {
      where.description = search;
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = startDate;
      }
      if (endDate) {
        where.date.lte = endDate;
      }
    }

    const injuries = await this.prismaService.pain.findMany({
      where,
      orderBy: {
        date: SortDirectionEnum.ASC,
      },
    });

    return injuries.map((pain) => PainAdapter.create(pain));
  }

  public async findByUuid(uuid: string): Promise<PainEntity> {
    const pain = await this.prismaService.pain.findUnique({
      where: { uuid },
    });
    return PainAdapter.create(pain);
  }

  public async delete(id: number): Promise<void> {
    await this.prismaService.pain.delete({
      where: { id },
    });
  }

  public async update(pain: PainEntity): Promise<void> {
    await this.prismaService.pain.update({
      where: { id: pain.getId() },
      data: pain.toJSON(),
    });
  }

  
    public async updateMany(pains: PainEntity[]): Promise<void> {
      await this.prismaService.$transaction(
        pains.map((pain) =>
          this.prismaService.pain.update({
            where: { id: pain.getId() },
            data: pain.toJSON(),
          }),
        ),
      );
    }
  
    public async deleteMany(pains: PainEntity[]): Promise<void> {
      await this.prismaService.$transaction(
        pains.map((pain) =>
          this.prismaService.pain.delete({
            where: { id: pain.getId() },
          }),
        ),
      );
    }
}