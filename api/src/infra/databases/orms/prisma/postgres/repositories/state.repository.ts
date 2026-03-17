import { Injectable } from '@nestjs/common';
import { PrismaPGService } from '../prisma-pg.service';
import { StateAdapter } from '../adapters';
import { StateEntity } from 'src/app/modules/state/entities';
import type { IStateRepository } from 'src/app/modules/state/repositories';
import { SortDirectionEnum } from 'src/app/shared';

@Injectable()
export class StatePostgresRepository implements IStateRepository {
  constructor(private readonly prismaService: PrismaPGService) {}

  public async create(state: StateEntity): Promise<{ uuid: string }> {
    state.setId(await this.getNextId());
    const { uuid } = await this.prismaService.state.create({
      data: StateAdapter.fromEntity(state),
    });
    return { uuid };
  }

  public async findByCountryId(uuid: string): Promise<StateEntity[]> {
    const { adapterManyFromDB } = StateAdapter;
    const states = await this.prismaService.state.findMany({
      where: {
        isEnabled: true,
        country: {
          uuid,
        },
      },
      orderBy: {
        name: SortDirectionEnum.ASC,
      },
    });

    if (!states) return null;

    return adapterManyFromDB(states);
  }

  public async findByUf(uf: string): Promise<StateEntity | null> {
    const { adapterFromDB } = StateAdapter;
    const state = await this.prismaService.state.findFirst({
      where: {
        uf: {
          equals: uf,
          mode: 'insensitive',
        },
      },
    });

    if (!state) return null;

    return adapterFromDB(state);
  }

  public async changeIsEnabledByUuid(
    uuid: string,
    isEnabled: boolean,
  ): Promise<void> {
    await this.prismaService.state.update({
      where: { uuid },
      data: { isEnabled },
    });
  }

  public async findById(id: number): Promise<StateEntity | null> {
    const { adapterFromDB } = StateAdapter;
    const state = await this.prismaService.state.findFirst({
      where: {
        id,
      },
    });

    return state ? adapterFromDB(state) : null;
  }

  public async findEnables(): Promise<StateEntity[]> {
    const { adapterManyFromDB } = StateAdapter;
    const states = await this.prismaService.state.findMany({
      where: {
        isEnabled: true,
      },
      orderBy: {
        name: SortDirectionEnum.ASC,
      },
    });

    return adapterManyFromDB(states);
  }

  public async findAll(): Promise<StateEntity[]> {
    const { adapterManyFromDB } = StateAdapter;
    const states = await this.prismaService.state.findMany({
      orderBy: {
        name: SortDirectionEnum.ASC,
      },
    });

    return adapterManyFromDB(states);
  }

  public async findByUuid(stateId: string): Promise<StateEntity | null> {
    const { adapterFromDB } = StateAdapter;
    const state = await this.prismaService.state.findUnique({
      where: {
        uuid: stateId,
      },
    });

    return state ? adapterFromDB(state) : null;
  }

  private async getNextId(): Promise<number> {
    const lastCountry = await this.prismaService.state.findFirst({
      orderBy: {
        id: SortDirectionEnum.DESC,
      },
    });

    return (lastCountry.id ?? 0) + 1;
  }
}
