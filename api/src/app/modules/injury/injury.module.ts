import { forwardRef, Module } from '@nestjs/common';
import { InjuryController } from './controllers';
import { InjuryPostgresRepository } from 'src/infra/databases/orms/prisma/postgres/repositories/injury.repository';
import { AthleteModule } from '../athlete/athlete.module';
import {
  CreateInjuryUseCase,
  DeleteInjuryUseCase,
  FindInjuryUseCase,
  ListInjuryUseCase,
  UpdateInjuryUseCase,
} from './usecases';

@Module({
  controllers: [InjuryController],
  imports: [forwardRef(() => AthleteModule)],
  providers: [
    CreateInjuryUseCase,
    ListInjuryUseCase,
    DeleteInjuryUseCase,
    FindInjuryUseCase,
    UpdateInjuryUseCase,
    {
      provide: 'IInjuryRepository',
      useClass: InjuryPostgresRepository,
    },
  ],
  exports: ['IInjuryRepository'],
})
export class InjuryModule {}
