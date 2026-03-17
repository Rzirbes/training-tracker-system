import { Injectable } from '@nestjs/common';
import {
  DefaultTrainingTypeEntity,
  IDefaultTrainingTypeRepository
} from 'src/app/modules/training-type';
import { PrismaPGService } from '../prisma-pg.service';

@Injectable()
export class DefaultTrainingTypePostgresRepository
  implements IDefaultTrainingTypeRepository
{
  constructor(private readonly prismaService: PrismaPGService) {}

  async create(trainingType: DefaultTrainingTypeEntity): Promise<void> {
    await this.prismaService.defaultTrainingType.create({
      data: {
        trainingTypeId: trainingType.getTrainingTypeId(),
      },
    });
  }

  async findUnique(): Promise<DefaultTrainingTypeEntity> {
    const trainingType = await this.prismaService.defaultTrainingType.findFirst();
    if (!trainingType) return null;
    return new DefaultTrainingTypeEntity(trainingType);
  }

  async update(trainingType: DefaultTrainingTypeEntity): Promise<void> {
    await this.prismaService.defaultTrainingType.update({
      where: { id: trainingType.getId() },
      data: {
        trainingTypeId: trainingType.getTrainingTypeId()
      },
    });
  }
}
