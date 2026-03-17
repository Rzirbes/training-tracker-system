import { Injectable } from '@nestjs/common';
import {
  WellBeingMonitoryEntity,
  IWellBeingRepository,
  GetWellBeingMonitoringRequestDto,
} from 'src/app/modules/monitory';
import { PrismaPGService } from '../prisma-pg.service';

@Injectable()
export class WellBeingPostgresRepository implements IWellBeingRepository {
  constructor(private readonly prismaService: PrismaPGService) {}

  async capture(entity: WellBeingMonitoryEntity): Promise<void> {
    await this.prismaService.wellBeingMonitoring.create({
      data: {
        date: entity.getDate(),
        athleteId: entity.getAthleteId(),
        sleep: entity.getSleep(),
        sleepHours: entity.getSleepHours(),
        stress: entity.getStress(),
        energy: entity.getEnergy(),
        pain: entity.getPain(),
        humor: entity.getHumor(),
        fatigue: entity.getFatigue(),
        motivation: entity.getMotivation(),
        nutrition: entity.getNutrition(),
        waterIntake: entity.getWaterIntake(),
      },
    });
  }

  async getWeekMonitoring(
    query: GetWellBeingMonitoringRequestDto,
  ): Promise<WellBeingMonitoryEntity[]> {
    const { athleteUuid, startDate, endDate } = query;
    const wellBeingCaptures =
      await this.prismaService.wellBeingMonitoring.findMany({
        where: {
          athlete: {
            uuid: athleteUuid,
          },
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
      });
    return wellBeingCaptures.map(
      (wellBeing) => new WellBeingMonitoryEntity(wellBeing),
    );
  }

  async getDay(
    query: GetWellBeingMonitoringRequestDto,
  ): Promise<WellBeingMonitoryEntity | null> {
    const { athleteUuid, startDate, endDate } = query;
    const wellBeing = await this.prismaService.wellBeingMonitoring.findFirst({
      where: {
        athlete: {
          uuid: athleteUuid,
        },
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
    if (!wellBeing) return null;
    return new WellBeingMonitoryEntity(wellBeing);
  }

  async findByUuid(uuid: string): Promise<WellBeingMonitoryEntity | null> {
    const wellBeing = await this.prismaService.wellBeingMonitoring.findUnique({
      where: {
        uuid,
      },
    });

    if (!wellBeing) return null;

    return new WellBeingMonitoryEntity(wellBeing);
  }

  async update(entity: WellBeingMonitoryEntity): Promise<void> {
    await this.prismaService.wellBeingMonitoring.update({
      where: {
        id: entity.getId(),
      },
      data: {
        sleep: entity.getSleep(),
        sleepHours: entity.getSleepHours(),
        stress: entity.getStress(),
        energy: entity.getEnergy(),
        pain: entity.getPain(),
        humor: entity.getHumor(),
        fatigue: entity.getFatigue(),
        motivation: entity.getMotivation(),
        nutrition: entity.getNutrition(),
        waterIntake: entity.getWaterIntake(),
      },
    });
  }
}
