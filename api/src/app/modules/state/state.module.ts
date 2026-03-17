import { Module } from '@nestjs/common';
import { StateController } from './controllers/state.controller';
import {
  CreateStateUseCase,
  GetStateByUuidUseCase,
  GetStatesByCountryUseCase,
  GetStatesUseCase,
} from './usecases';
import { StatePostgresRepository } from 'src/infra/databases/orms/prisma/postgres/repositories/state.repository';

@Module({
  controllers: [StateController],
  providers: [
    CreateStateUseCase,
    GetStatesUseCase,
    GetStateByUuidUseCase,
    GetStatesByCountryUseCase,
    {
      provide: 'IStateRepository',
      useClass: StatePostgresRepository,
    },
  ],
  exports: ['IStateRepository', GetStateByUuidUseCase],
})
export class StateModule {}
