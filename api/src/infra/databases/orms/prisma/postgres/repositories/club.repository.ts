import { Injectable } from '@nestjs/common';
import { ClubEntity } from 'src/app/modules/club/entities';
import { IClubRepository } from 'src/app/modules/club/repositories';
import { PrismaPGService } from '../prisma-pg.service';
import { ClubAdapter } from '../adapters';
import { SortDirectionEnum, transformer } from 'src/app/shared';

@Injectable()
export class ClubPostgresRepository implements IClubRepository {
  baseInclude = {
    country: true,
    state: true,
    city: true,
  };

  constructor(private readonly prismaService: PrismaPGService) {}

  public async create(club: ClubEntity): Promise<{ uuid: string }> {
    const { uuid } = await this.prismaService.club.create({
      data: ClubAdapter.fromEntity(club),
    });
    return { uuid };
  }

  public async findAll({
    city,
    isEnabled = true,
  }: {
    city?: string;
    isEnabled?: boolean;
  }): Promise<ClubEntity[]> {
    const clubs = await this.prismaService.club.findMany({
      where: {
        isEnabled,
        ...(!!city && {
          city: {
            uuid: city,
          },
        }),
      },
      include: this.baseInclude,
      orderBy: {
        name: SortDirectionEnum.ASC,
      },
    });

    return ClubAdapter.manyFromDB(clubs);
  }

  public async findByNameAndAddress(
    name: string,
    countryId: string,
    stateId: string,
    cityId: string,
  ): Promise<ClubEntity | null> {
    const club = await this.prismaService.club.findFirst({
      where: {
        AND: [
          {
            name: {
              contains: transformer.nameToTitleCase(name),
            },
          },
          {
            country: {
              uuid: countryId,
            },
          },
          {
            state: {
              uuid: stateId,
            },
          },
          {
            city: {
              uuid: cityId,
            },
          },
        ],
      },
      include: this.baseInclude,
    });

    if (!club) return null;

    return ClubAdapter.fromDB(club);
  }

  public async findByUuid(uuid: string[]): Promise<ClubEntity[]> {
    const clubs = await this.prismaService.club.findMany({
      where: {
        uuid: {
          in: uuid,
        },
      },
      include: this.baseInclude,
    });
    return ClubAdapter.manyFromDB(clubs);
  }
}
