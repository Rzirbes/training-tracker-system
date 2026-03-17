import { Module, forwardRef } from '@nestjs/common';
import { TrainingController } from './controllers';
import {
  CreateTrainingUseCase,
  DeleteTrainingUseCase,
  FindTrainingUseCase,
  ListTrainingUseCase,
  UpdateTrainingUseCase,
} from './usecases';
import { TrainingPostgresRepository } from 'src/infra/databases/orms/prisma/postgres/repositories/training.repository';
import { AthleteModule } from '../athlete/athlete.module';
import { TrainingTypeModule } from '../training-type/training-type.module';
import { TrainingPlanningModule } from '../training-planning/training-planning.module';
import { ScheduleModule } from '../schedule/schedule.module';
import { InjuryModule } from '../injury/injury.module';
import { PainModule } from '../pain/pain.module';
import { MonitoringModule } from '../monitory/monitoring.module';

@Module({
  imports: [
    forwardRef(() => AthleteModule),
    forwardRef(() => TrainingTypeModule),
    forwardRef(() => ScheduleModule),
    forwardRef(() => TrainingPlanningModule),
    forwardRef(() => InjuryModule),
    forwardRef(() => PainModule),
    forwardRef(() => MonitoringModule),
  ],
  controllers: [TrainingController],
  providers: [
    CreateTrainingUseCase,
    ListTrainingUseCase,
    DeleteTrainingUseCase,
    UpdateTrainingUseCase,
    FindTrainingUseCase,
    {
      provide: 'ITrainingRepository',
      useClass: TrainingPostgresRepository,
    },
  ],
  exports: ['ITrainingRepository'],
})
export class TrainingModule {}
