import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  BodySide,
  bodySides,
  degreeLabels,
  InjuryContext,
  injuryContexts,
  InjuryDegree,
  type IBaseUseCase
} from 'src/app/shared';
import { GetInjuryDashboardRequestDto,GetInjuryDashboardResponseDto } from '../dtos';
import { InjuryEntity } from '../../injury/entities';
import type { IAthleteRepository } from '../../athlete';
import type { IInjuryRepository } from '../../injury/repositories';

@Injectable()
export class GetInjuryDashboardUseCase implements IBaseUseCase {
  constructor(
    @Inject('IAthleteRepository')
    private readonly athleteRepository: IAthleteRepository,
    @Inject('IInjuryRepository')
    private readonly injuryRepository: IInjuryRepository,
  ) {}

  public async execute(
    input: GetInjuryDashboardRequestDto,
  ): Promise<GetInjuryDashboardResponseDto> {
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

    const injuries = await this.injuryRepository.findMany({
      athleteId: athlete.getId(),
      ...(startStr && { startDate }),
      ...(endStr && { endDate }),
    });

    return {
      injuryRecovery: this.getInjuryRecovery(injuries),
      bodySide: this.getBodySide(injuries),
      bodyHeatMap: this.getBodyHeatMap(injuries),
      recurrence: this.getRecurrence(injuries),
      firstGameMinutes: this.getFirstGameMinutes(injuries),
      type: this.getType(injuries),
      occurredDuring: this.getOccurredDuring(injuries),
      degree: this.getInjuryDegree(injuries),
    };
  }

  private getInjuryRecovery(injuries: InjuryEntity[]) {
    const map = new Map<string, { daysTotal: number; count: number }>();

    for (const injury of injuries) {

      const returnDate = injury.getReturnDateActual()
        ? new Date(injury.getReturnDateActual())
        : null;

      if (!returnDate) continue;

      const days =
        (returnDate.getTime() - new Date(injury.getDate()).getTime()) /
        (1000 * 60 * 60 * 24);

      if (days < 0) {
        console.warn('Data de retorno anterior à data da lesão:', {
          type: injury.getType(),
          injuryDate: injury.getDate(),
          returnDate,
        });
        continue; // ignora casos inválidos
      }
      const stat = map.get(injury.getType()) ?? { daysTotal: 0, count: 0 };
      stat.daysTotal += days;
      stat.count++;
      map.set(injury.getType(), stat);
    }

    return Array.from(map.entries()).map(([type, { daysTotal, count }]) => ({
      type,
      dias: Math.round(daysTotal / count),
    }));
  }

  private getBodySide(injuries: InjuryEntity[]) {
    const countMap = new Map<string, number>();

    for (const injury of injuries) {
      const label = bodySides[injury.getBodySide() as BodySide];
      countMap.set(label, (countMap.get(label) ?? 0) + 1);
    }

    return Object.values(BodySide).map((side) => {
      const label = bodySides[side];
      return { side: label, total: countMap.get(label) ?? 0 };
    });
  }

  private getInjuryDegree(injuries: InjuryEntity[]) {
    const countMap = new Map<string, number>();

    for (const injury of injuries) {
      const label = degreeLabels[injury.getDegree() as InjuryDegree];
      countMap.set(label, (countMap.get(label) ?? 0) + 1);
    }

    return Object.values(InjuryDegree).map((degree) => {
      const label = degreeLabels[degree];
      return { degree: label, total: countMap.get(label) ?? 0 };
    });
  }

  private getOccurredDuring(injuries: InjuryEntity[]) {
    return Object.values(InjuryContext).map((ctx) => ({
      type: injuryContexts[ctx],
      total: injuries.filter((injury) => injury.getOccurredDuring() === ctx)
        .length,
    }));
  }

  private getType(injuries: InjuryEntity[]) {
    const countMap = new Map<string, number>();

    for (const injury of injuries) {
      countMap.set(injury.getType(), (countMap.get(injury.getType()) ?? 0) + 1);
    }

    return Array.from(countMap.entries()).map(([type, total]) => ({
      type,
      total,
    }));
  }

  private getFirstGameMinutes(injuries: InjuryEntity[]) {
    const build = injuries
      .filter((injury) => !!injury.getMinutesFirstGame())
      .map((injury) => ({
        type: injury.getType(),
        minutos: injury.getMinutesFirstGame(),
      }));

    return build;
  }

  private getRecurrence(injuries: InjuryEntity[]) {
    const countMap = new Map<string, number>();

    for (const injury of injuries) {
      countMap.set(injury.getType(), (countMap.get(injury.getType()) ?? 0) + 1);
    }

    return Array.from(countMap.entries()).map(([type, total]) => ({
      type,
      total,
    }));
    // .filter(({ total }) => total > 1);
  }

  private getBodyHeatMap(injuries: InjuryEntity[]) {
    const countMap = new Map<string, number>();

    for (const injury of injuries) {
      countMap.set(
        injury.getBodyRegion(),
        (countMap.get(injury.getBodyRegion()) ?? 0) + 1,
      );
    }

    return Array.from(countMap.entries()).map(([type, total]) => ({
      type,
      total,
    }));
  }
}

