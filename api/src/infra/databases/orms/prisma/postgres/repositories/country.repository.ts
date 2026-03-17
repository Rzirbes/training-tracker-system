import { CountryEntity } from "src/app/modules/country/entities";
import { ICountryRepository } from "src/app/modules/country/repositories";
import { CountryAdapter } from "../adapters";
import { PrismaPGService } from "../prisma-pg.service";
import { Injectable } from "@nestjs/common";
import { SortDirectionEnum } from 'src/app/shared';

@Injectable()
export class CountryPostgresRepository implements ICountryRepository {
  constructor(private readonly prismaService: PrismaPGService) {}

  public async create(country: CountryEntity): Promise<{ uuid: string }> {
    country.setId(await this.getNextId());
    const { uuid } = await this.prismaService.country.create({
      data: CountryAdapter.fromEntity(country),
    });
    return { uuid };
  }

  public async findEnables(): Promise<CountryEntity[]> {
    const { adapterManyFromDB } = CountryAdapter;
    const countries = await this.prismaService.country.findMany({
      where: {
        isEnabled: true,
      },
      orderBy: {
        name: SortDirectionEnum.ASC,
      },
    });

    return adapterManyFromDB(countries);
  }

  public async findAll(): Promise<CountryEntity[]> {
    const { adapterManyFromDB } = CountryAdapter;
    const countries = await this.prismaService.country.findMany({
      orderBy: {
        name: SortDirectionEnum.ASC,
      },
    });

    return adapterManyFromDB(countries);
  }

  public async findByUuid(countryId: string): Promise<CountryEntity | null> {
    const { adapterFromDB } = CountryAdapter;
    const country = await this.prismaService.country.findUnique({
      where: {
        uuid: countryId,
      },
    });

    return country ? adapterFromDB(country) : null;
  }

  private async getNextId(): Promise<number> {
    const lastCountry = await this.prismaService.country.findFirst({
      orderBy: {
        id: SortDirectionEnum.DESC,
      },
    });

    return (lastCountry.id ?? 0) + 1;
  }
}