import { Injectable } from '@nestjs/common';
import { PrismaPGService } from '../prisma-pg.service';
import { SortDirectionEnum, transformer } from 'src/app/shared';
import { CityEntity } from 'src/app/modules/city/entities/city.entity';
import { CityAdapter, type CityDatabase } from '../adapters';
import type { ICityRepository } from 'src/app/modules/city/repositories';

@Injectable()
export class CityPostgresRepository implements ICityRepository {
  baseInclude = {
    state: {
      select: {
        uuid: true,
      },
    },
  };

  constructor(private readonly prismaService: PrismaPGService) {}

  public async create(city: CityEntity): Promise<{ uuid: string }> {
    city.setId(await this.getNextId());
    const { uuid } = await this.prismaService.city.create({
      data: CityAdapter.fromEntity(city),
    });
    return { uuid };
  }

  public async findById(
    id: number,
    stateId?: number | undefined,
  ): Promise<CityEntity | null> {
    const { adapterFromDB } = CityAdapter;
    const city = await this.prismaService.city.findUnique({
      where: {
        id,
        ...(stateId && { stateId }),
      },
      include: this.baseInclude,
    });

    return city ? adapterFromDB(city) : null;
  }

  public async findByName(
    name: string,
    stateId: string,
  ): Promise<CityEntity | null> {
    const { adapterFromDB } = CityAdapter;
    const city = await this.prismaService.city.findFirst({
      where: {
        AND: [
          {
            slug: {
              contains: transformer.slug(name),
            },
          },
          {
            state: {
              uuid: stateId,
            },
          },
        ],
      },
      include: this.baseInclude,
    });

    if (!city) return null;

    return adapterFromDB(city);
  }

  async findByStateId(stateId: string): Promise<CityEntity[]> {
    const { adapterManyFromDB } = CityAdapter;

    const cities = <CityDatabase[]>await this.prismaService.$queryRaw`
			SELECT c.*
			FROM states s
			RIGHT JOIN cities c ON s.id = c.state_id
			WHERE s.uuid = ${stateId}::uuid
			ORDER BY c.slug ASC;
		`;

    return adapterManyFromDB(cities);
  }

  public async findByUuid(cityId: string): Promise<CityEntity | null> {
    const { adapterFromDB } = CityAdapter;
    const city = await this.prismaService.city.findUnique({
      where: {
        uuid: cityId,
      },
      include: this.baseInclude,
    });

    return city ? adapterFromDB(city) : null;
  }

  private async getNextId(): Promise<number> {
    const lastCountry = await this.prismaService.city.findFirst({
      orderBy: {
        id: SortDirectionEnum.DESC,
      },
    });

    return (lastCountry.id ?? 0) + 1;
  }
}
