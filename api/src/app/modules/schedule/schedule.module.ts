import { forwardRef, Module } from '@nestjs/common';
import { AthleteModule } from '../athlete/athlete.module';
import { CoachModule } from '../coaches/coach.module';
import { TrainingTypeModule } from '../training-type/training-type.module';
import { QueueModule } from '../queues/queue.module';
import {
  CreateScheduleUseCase,
  FindSchedulesUseCase,
  UpdateScheduleUseCase,
  CancelScheduleUseCase,
  FindScheduleByUuidUseCase,
  AthleteConfirmScheduleUseCase,
  AthleteCancelScheduleUseCase,
  DeleteScheduleUseCase,
  SendScheduleNotificationToAthletesUseCase,
  CreateAbsenceScheduleUseCase,
  UpdateAbsenceScheduleUseCase,
  DeleteAbsenceScheduleUseCase,
} from './usecases';
import { ScheduleController } from './controllers';
import { SchedulePostgresRepository } from 'src/infra/databases/orms/prisma/postgres/repositories/schedule.repository';

@Module({
  imports: [
    forwardRef(() => QueueModule),
    forwardRef(() => AthleteModule),
    forwardRef(() => CoachModule),
    forwardRef(() => TrainingTypeModule),
  ],
  controllers: [ScheduleController],
  providers: [
    CreateScheduleUseCase,
    FindSchedulesUseCase,
    UpdateScheduleUseCase,
    AthleteConfirmScheduleUseCase,
    CancelScheduleUseCase,
    FindScheduleByUuidUseCase,
    AthleteCancelScheduleUseCase,
    DeleteScheduleUseCase,
    SendScheduleNotificationToAthletesUseCase,
    CreateAbsenceScheduleUseCase,
    UpdateAbsenceScheduleUseCase,
    DeleteAbsenceScheduleUseCase,
    {
      provide: 'IScheduleRepository',
      useClass: SchedulePostgresRepository,
    },
  ],
  exports: ['IScheduleRepository', SendScheduleNotificationToAthletesUseCase],
})
export class ScheduleModule {}
