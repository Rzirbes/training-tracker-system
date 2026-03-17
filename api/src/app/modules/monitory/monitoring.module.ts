import { Module, forwardRef } from '@nestjs/common';
import { MonitoringController } from './controllers';
import {
  SendWellBeingToAthletesUseCase,
  CaptureAthleteWellBeingUseCase,
  MonotonyMonitoringUseCase,
  GetWeekMonitoringUseCase,
  GetWellBeingMonitoringUseCase,
  UpdateWeekLoadUseCase,
  GetInjuryDashboardUseCase,
  GetDayWellBeingUseCase,
  CreateDayWellBeingUseCase,
  UpdateDayWellBeingUseCase,
  GetPainDashboardUseCase,
} from './usecases';
import { AthleteModule } from '../athlete/athlete.module';
import { TrainingModule } from '../training/training.module';
import { QueueModule } from '../queues/queue.module';
import { TrainingPlanningModule } from '../training-planning/training-planning.module';
import { MonitoryPostgresRepository } from 'src/infra/databases/orms/prisma/postgres/repositories';
import { WellBeingPostgresRepository } from 'src/infra/databases/orms/prisma/postgres/repositories/well-being.repository';
import { MonitoryTokenPostgresRepository } from 'src/infra/databases/orms/prisma/postgres/repositories/monitory-token.repository';
import { UnsubscribeModule } from '../unsubscribe/unsubscribe.module';
import { InjuryModule } from '../injury/injury.module';
import { PainModule } from '../pain/pain.module';

@Module({
  controllers: [MonitoringController],
  imports: [
    UnsubscribeModule,
    QueueModule,
    forwardRef(() => InjuryModule),
    forwardRef(() => PainModule),
    forwardRef(() => AthleteModule),
    forwardRef(() => TrainingModule),
    forwardRef(() => TrainingPlanningModule),
  ],
  providers: [
    GetWeekMonitoringUseCase,
    MonotonyMonitoringUseCase,
    UpdateWeekLoadUseCase,
    SendWellBeingToAthletesUseCase,
    CaptureAthleteWellBeingUseCase,
    GetWellBeingMonitoringUseCase,
    GetInjuryDashboardUseCase,
    GetDayWellBeingUseCase,
    CreateDayWellBeingUseCase,
    UpdateDayWellBeingUseCase,
    GetPainDashboardUseCase,
    {
      provide: 'IMonitoryRepository',
      useClass: MonitoryPostgresRepository,
    },
    {
      provide: 'IWellBeingRepository',
      useClass: WellBeingPostgresRepository,
    },
    {
      provide: 'IMonitoryTokenRepository',
      useClass: MonitoryTokenPostgresRepository,
    },
  ],
  exports: [
    SendWellBeingToAthletesUseCase,
    UpdateWeekLoadUseCase,
    'IMonitoryRepository',
  ],
})
export class MonitoringModule {}
