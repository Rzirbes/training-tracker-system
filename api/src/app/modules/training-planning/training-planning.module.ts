import { Module, forwardRef } from '@nestjs/common';
import { TrainingPlanningController } from './controllers';
import {
  CreateTrainingPlanningUseCase,
  DeleteTrainingPlanningUseCase,
  ListTrainingPlanningUseCase,
  FinishTrainingPlanningUseCase,
  UpdateTrainingPlanningUseCase,
  FindTrainingPlanningUseCase,
} from './usecases';
import { TrainingPlanningRepository } from 'src/infra/databases/orms/prisma/postgres/repositories/training-planning.repository';
import { AthleteModule } from '../athlete/athlete.module';
import { TrainingTypeModule } from '../training-type/training-type.module';

@Module({
  imports: [
    forwardRef(() => AthleteModule),
    forwardRef(() => TrainingTypeModule),
  ],
  controllers: [TrainingPlanningController],
  providers: [
    CreateTrainingPlanningUseCase,
    ListTrainingPlanningUseCase,
    FindTrainingPlanningUseCase,
    UpdateTrainingPlanningUseCase,
    DeleteTrainingPlanningUseCase,
    FinishTrainingPlanningUseCase,
    {
      provide: 'ITrainingPlanningRepository',
      useClass: TrainingPlanningRepository,
    },
  ],
  exports: ['ITrainingPlanningRepository'],
})
export class TrainingPlanningModule {}
