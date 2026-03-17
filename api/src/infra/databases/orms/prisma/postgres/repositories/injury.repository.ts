import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaPGService } from "../prisma-pg.service";
import { InjuryEntity } from "src/app/modules/injury/entities";
import { IInjuryRepository } from "src/app/modules/injury/repositories";
import { InjuryAdapter } from "../adapters";
import { SortDirectionEnum } from "src/app/shared";

@Injectable()
export class InjuryPostgresRepository implements IInjuryRepository {
  constructor(private readonly prismaService: PrismaPGService) {}

  public async createMany(injuries: InjuryEntity[]): Promise<void> {
    await this.prismaService.injury.createMany({
      data: injuries.map((entity) => ({
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
  }): Promise<InjuryEntity[]> {
    const { athleteId, page, size, search = '', startDate, endDate } = query;

    const where: Prisma.InjuryWhereInput = {
      athleteId,
    };

    if (search) {
      where.type = search;
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

    const injuries = await this.prismaService.injury.findMany({
      take: size,
      skip: (page - 1) * size,
      where,
      orderBy: {
        date: SortDirectionEnum.ASC,
      },
    });

    return injuries.map((injury) => InjuryAdapter.create(injury));
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

    const where: Prisma.InjuryWhereInput = {
      athleteId,
    };

    if (search) {
      where.type = search;
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

    const total = await this.prismaService.injury.count({
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
  }): Promise<InjuryEntity[]> {
    const { athleteId, search = '', startDate, endDate } = query;

    const where: Prisma.InjuryWhereInput = {
      athleteId,
    };

    if (search) {
      where.type = search;
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

    const injuries = await this.prismaService.injury.findMany({
      where,
      orderBy: {
        date: SortDirectionEnum.ASC,
      },
    });

    return injuries.map((injury) => InjuryAdapter.create(injury));
  }

  public async findByUuid(uuid: string): Promise<InjuryEntity> {
    const injury = await this.prismaService.injury.findUnique({
      where: { uuid },
    });
    return InjuryAdapter.create(injury);
  }

  public async delete(id: number): Promise<void> {
    await this.prismaService.injury.delete({
      where: { id },
    });
  }

  public async update(injury: InjuryEntity): Promise<void> {
    await this.prismaService.injury.update({
      where: { id: injury.getId() },
      data: injury.toJSON(),
    });
  }

  public async updateMany(injuries: InjuryEntity[]): Promise<void> {
    await this.prismaService.$transaction(
      injuries.map((injury) =>
        this.prismaService.injury.update({
          where: { id: injury.getId() },
          data: injury.toJSON(),
        }),
      ),
    );
  }

  public async deleteMany(injuries: InjuryEntity[]): Promise<void> {
    await this.prismaService.$transaction(
      injuries.map((injury) =>
        this.prismaService.injury.delete({
          where: { id: injury.getId() },
        }),
      ),
    );
  }
}