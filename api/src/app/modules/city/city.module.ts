import { Module } from '@nestjs/common';
import { CityController } from './controllers/city.controller';
import {
  CreateCityUseCase,
  GetCitiesByStateUseCase,
  RetrieveCityValidatedByStateUseCase,
} from './usecases';
import { CityPostgresRepository } from 'src/infra/databases/orms/prisma/postgres/repositories/city.repository';

@Module({
  controllers: [CityController],
  providers: [
    CreateCityUseCase,
    GetCitiesByStateUseCase,
    {
      provide: 'ICityRepository',
      useClass: CityPostgresRepository,
    },
    RetrieveCityValidatedByStateUseCase,
  ],
  exports: ['ICityRepository', RetrieveCityValidatedByStateUseCase],
})
export class CityModule {}
