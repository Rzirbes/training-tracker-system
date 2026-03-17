import { Injectable } from '@nestjs/common';
import { PrismaPGService } from '../prisma-pg.service';
import {
  AthleteClubEntity,
  AthleteEntity,
  IAthleteRepository,
  ListAthletesRequestDto,
} from 'src/app/modules/athlete';
import { AthleteAdapter } from '../adapters';
import { SortDirectionEnum } from 'src/app/shared';

@Injectable()
export class AthletePostgresRepository implements IAthleteRepository {
  constructor(private readonly prismaService: PrismaPGService) {}

  public async create(athlete: AthleteEntity): Promise<void> {
    const address = this._buildUpsertAddress(athlete);
    const injuries = athlete.getInjuries()?.map((injury) => injury.toJSON());
    const pains = athlete.getPains()?.map((pain) => pain.toJSON());
    const clubs = athlete.getClubs()?.map((club) => ({
      clubId: club.getClub().getId(),
      startDate: club.getStartDate(),
      endDate: club.getEndDate(),
    }));

    await this.prismaService.athlete.create({
      data: {
        ...AthleteAdapter.fromEntity(athlete),
        ...(!!injuries && {
          injuries: {
            createMany: {
              data: injuries,
            },
          },
        }),
        ...(!!pains && {
          pains: {
            createMany: {
              data: pains,
            },
          },
        }),
        ...(!!clubs && {
          athleteClubs: {
            createMany: {
              data: clubs,
            },
          },
        }),
        ...(address.included && {
          address: {
            create: address.data,
          },
        }),
      },
    });
  }

  public async findByEmail(email: string): Promise<AthleteEntity | null> {
    const athlete = await this.prismaService.athlete.findUnique({
      where: {
        email,
      },
    });
    if (!athlete) return null;
    return AthleteAdapter.create(athlete);
  }

  public async findByCpf(cpf: string): Promise<AthleteEntity | null> {
    const athlete = await this.prismaService.athlete.findFirst({
      where: {
        cpf,
      },
    });
    if (!athlete) return null;
    return AthleteAdapter.create(athlete);
  }

  public async findAll(query: {
    isEnabled: boolean;
    not?: { emails: string[] };
  }): Promise<AthleteEntity[]> {
    const athletes = await this.prismaService.athlete.findMany({
      where: {
        isEnabled: query.isEnabled,
        ...(query?.not?.emails && {
          email: { not: { in: query.not.emails } },
        }),
      },
      orderBy: {
        name: SortDirectionEnum.ASC,
      },
    });
    return athletes.map((athlete) => AthleteAdapter.create(athlete));
  }

  public async listAll({
    page = 1,
    size = 10,
    search,
    isEnabled,
  }: ListAthletesRequestDto): Promise<AthleteEntity[]> {
    const athletes = await this.prismaService.athlete.findMany({
      take: size,
      skip: (page - 1) * size,
      where: {
        isEnabled,
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        }),
      },
      orderBy: {
        name: SortDirectionEnum.ASC,
      },
    });
    return athletes.map((athlete) => AthleteAdapter.create(athlete));
  }

  public async count({
    search,
    isEnabled,
  }: Pick<ListAthletesRequestDto, 'search' | 'isEnabled'>): Promise<number> {
    return await this.prismaService.athlete.count({
      where: {
        isEnabled,
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        }),
      },
    });
  }

  public async findByUuid(uuid: string): Promise<AthleteEntity | null> {
    const athlete = await this.prismaService.athlete.findUnique({
      where: { uuid },
      include: {
        injuries: true,
        pains: true,
        athleteClubs: {
          include: {
            club: {
              include: {
                city: true,
                country: true,
                state: true,
              },
            },
          },
          orderBy: {
            startDate: SortDirectionEnum.DESC,
          },
        },
        address: {
          include: {
            city: true,
            country: true,
            state: true,
          },
        },
      },
    });
    if (!athlete) return null;
    return AthleteAdapter.create(athlete);
  }

  public async update(athlete: AthleteEntity): Promise<void> {
    const addressId = athlete.getAddressId();
    const address = this._buildUpsertAddress(athlete);

    await this.prismaService.athlete.update({
      where: { uuid: athlete.getUuid() },
      data: {
        ...AthleteAdapter.fromEntity(athlete),
        ...(address.included && {
          address: addressId
            ? {
                update: {
                  where: {
                    id: addressId,
                  },
                  data: address.data,
                },
              }
            : {
                create: address.data,
              },
        }),
      },
    });
  }

  public async searchByDayWithPlanningOrDailyMonitor(query: {
    day: Date;
    not?: { emails: string[] };
  }): Promise<AthleteEntity[]> {
    const { day, not } = query;

    const start = new Date(day);
    const end = new Date(day);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 59);

    const unsubscribe = not?.emails && {
      email: { not: { in: not.emails } },
    };

    try {
      const athletes = await this.prismaService.athlete.findMany({
        where: {
          OR: [
            {
              isEnabled: true,
              isMonitorDaily: true,
              ...unsubscribe,
            },
            {
              ...unsubscribe,
              isEnabled: true,
              trainingPlannings: {
                some: {
                  date: {
                    gte: start,
                    lte: end,
                  },
                },
              },
            },
          ],
        },
      });

      return athletes.map((athlete) => AthleteAdapter.create(athlete));
    } catch (error) {
      throw error;
    }
  }

  public async addClubs(clubs: AthleteClubEntity[]): Promise<void> {
    await this.prismaService.$transaction(
      clubs.map((contract) =>
        this.prismaService.athleteClub.create({
          data: {
            startDate: contract.getStartDate(),
            endDate: contract.getEndDate(),
            athlete: {
              connect: {
                id: contract.getAthleteId(),
              },
            },
            club: {
              connect: {
                uuid: contract.getClubId(),
              },
            },
          },
        }),
      ),
    );
  }

  public async updateClubs(clubs: AthleteClubEntity[]): Promise<void> {
    await this.prismaService.$transaction(
      clubs.map((contract) =>
        this.prismaService.athleteClub.update({
          where: { id: contract.getId() },
          data: {
            startDate: contract.getStartDate(),
            endDate: contract.getEndDate(),
            club: {
              connect: {
                uuid: contract.getClubId(),
              },
            },
          },
        }),
      ),
    );
  }

  public async removeClubs(clubs: AthleteClubEntity[]): Promise<void> {
    await this.prismaService.$transaction(
      clubs.map((contract) =>
        this.prismaService.athleteClub.delete({
          where: { id: contract.getId() },
        }),
      ),
    );
  }

  private _buildUpsertAddress(athlete: AthleteEntity) {
    const address = athlete.getAddress();

    if (!address)
      return {
        included: false,
      };

    const zipCode = address?.getZipCode();
    const street = address?.getStreet();
    const buildingNumber = address?.getBuildingNumber();
    const neighborhood = address?.getNeighborhood();
    const complement = address?.getComplement();
    const countryId = address?.getCountryId();
    const stateId = address?.getStateId();
    const cityId = address?.getCityId();

    const included = [
      buildingNumber,
      zipCode,
      street,
      neighborhood,
      cityId,
      stateId,
      countryId,
      complement,
    ].some(Boolean);

    const data = {
      zipCode,
      street,
      buildingNumber,
      neighborhood,
      complement,
      ...(countryId && {
        country: {
          connect: {
            uuid: countryId,
          },
        },
      }),
      ...(!!cityId && {
        city: {
          connect: {
            uuid: cityId,
          },
        },
      }),
      ...(!!stateId && {
        state: {
          connect: {
            uuid: stateId,
          },
        },
      }),
    };

    return { included, data };
  }
}
