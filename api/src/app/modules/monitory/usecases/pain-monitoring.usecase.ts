import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  BodySide,
  bodySides,
  InjuryContext,
  injuryContexts,
  type IBaseUseCase
} from 'src/app/shared';
import { GetPainDashboardRequestDto,GetPainDashboardResponseDto } from '../dtos';
import { PainEntity } from '../../pain/entities';
import type { IAthleteRepository } from '../../athlete';
import type { IPainRepository } from '../../pain/repositories';

@Injectable()
export class GetPainDashboardUseCase implements IBaseUseCase {
  constructor(
    @Inject('IAthleteRepository')
    private readonly athleteRepository: IAthleteRepository,
    @Inject('IPainRepository')
    private readonly painRepository: IPainRepository,
  ) {}

  public async execute(
    input: GetPainDashboardRequestDto,
  ): Promise<GetPainDashboardResponseDto> {
    const { athleteUuid, startDate: startStr, endDate: endStr } = input;

    const athlete = await this.athleteRepository.findByUuid(athleteUuid);
    if (!athlete) {
      throw new NotFoundException({
        title: 'Atleta não encontrado!',
        message: 'Verifique e tente novamente...',
      });
    }

    const startDate = new Date(startStr);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(endStr);
    endDate.setHours(23, 59, 59, 999);

    const pains = await this.painRepository.findMany({
      athleteId: athlete.getId(),
      ...(startStr && { startDate }),
      ...(endStr && { endDate }),
    });

    return {
      bodySide: this.getBodySide(pains),
      bodyHeatMap: this.getBodyHeatMap(pains),
      recurrence: this.getRecurrence(pains),
      occurredDuring: this.getOccurredDuring(pains),
    };
  }

  private getBodySide(pains: PainEntity[]) {
    const countMap = new Map<string, number>();

    for (const pain of pains) {
      const label = bodySides[pain.getBodySide() as BodySide];
      countMap.set(label, (countMap.get(label) ?? 0) + 1);
    }

    return Object.values(BodySide).map((side) => {
      const label = bodySides[side];
      return { side: label, total: countMap.get(label) ?? 0 };
    });
  }

  private getOccurredDuring(pains: PainEntity[]) {
    return Object.values(InjuryContext).map((ctx) => ({
      type: injuryContexts[ctx],
      total: pains.filter((pain) => pain.getOccurredDuring() === ctx)
        .length,
    }));
  }

  private getRecurrence(pains: PainEntity[]) {
    const countMap = new Map<string, number>();

    for (const pain of pains) {
      countMap.set(pain.getBodyRegion(), (countMap.get(pain.getBodyRegion()) ?? 0) + 1);
    }

    return Array.from(countMap.entries()).map(([type, total]) => ({
      type,
      total,
    }));
  }

  private getBodyHeatMap(pains: PainEntity[]) {
    const countMap = new Map<string, number>();

    for (const pain of pains) {
      countMap.set(
        pain.getBodyRegion(),
        (countMap.get(pain.getBodyRegion()) ?? 0) + 1,
      );
    }

    return Array.from(countMap.entries()).map(([type, total]) => ({
      type,
      total,
    }));
  }
}

