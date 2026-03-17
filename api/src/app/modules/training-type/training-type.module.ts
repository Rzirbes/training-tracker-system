import { Module } from '@nestjs/common';
import { TrainingTypeController } from './controllers';
import {
  CreateTrainingTypeUseCase,
  FindTrainingTypeUseCase,
  GetAllTrainingTypesUseCase,
  ListTrainingTypeUseCase,
  UpdateDefaultTrainingTypeUseCase,
  UpdateTrainingTypeStatusUseCase,
  UpdateTrainingTypeUseCase,
} from './usecases';
import { TrainingTypePostgresRepository } from 'src/infra/databases/orms/prisma/postgres';
import { DefaultTrainingTypePostgresRepository } from 'src/infra/databases/orms/prisma/postgres/repositories/default-training-type.repository';

@Module({
  controllers: [TrainingTypeController],
  providers: [
    CreateTrainingTypeUseCase,
    ListTrainingTypeUseCase,
    GetAllTrainingTypesUseCase,
    UpdateTrainingTypeUseCase,
    UpdateTrainingTypeStatusUseCase,
    FindTrainingTypeUseCase,
    UpdateDefaultTrainingTypeUseCase,
    {
      provide: 'ITrainingTypeRepository',
      useClass: TrainingTypePostgresRepository,
    },
    {
      provide: 'IDefaultTrainingTypeRepository',
      useClass: DefaultTrainingTypePostgresRepository,
    },
  ],
  exports: ['ITrainingTypeRepository', 'IDefaultTrainingTypeRepository'],
})
export class TrainingTypeModule {}
