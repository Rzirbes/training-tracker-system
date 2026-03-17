import { Module, forwardRef } from '@nestjs/common';
import {
  CreateCoachUseCase,
  FindCoachUseCase,
  GetCoachesUseCase,
  UpdateCoachStatusUseCase,
  UpdateCoachUseCase,
  GetAllCoachesUseCase,
} from './usecases';
import { CoachController } from './controllers';
import { QueueModule } from '../queues/queue.module';
import { SecurityModule } from 'src/infra/security/security.module';
import { AuthModule } from '../auth/auth.module';
import { CoachPostgresRepository } from 'src/infra/databases/orms/prisma/postgres/repositories/coach.repository';

@Module({
  imports: [
    QueueModule,
    forwardRef(() => AuthModule),
    forwardRef(() => SecurityModule),
  ],
  controllers: [CoachController],
  providers: [
    CreateCoachUseCase,
    GetCoachesUseCase,
    UpdateCoachStatusUseCase,
    FindCoachUseCase,
    UpdateCoachUseCase,
    GetAllCoachesUseCase,
    {
      provide: 'ICoachRepository',
      useClass: CoachPostgresRepository,
    },
  ],
  exports: ['ICoachRepository'],
})
export class CoachModule {}
