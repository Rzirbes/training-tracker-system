import { MulterModule } from '@nestjs/platform-express';
import { forwardRef, Module } from '@nestjs/common';
import {
  CreateAthleteUseCase,
  ListAthletesUseCase,
  FindAthleteUseCase,
  UpdateAthleteStatusUseCase,
  UpdateAthleteUseCase,
  GetAllAthletesUseCase,
} from './usecases';
import { AthleteController } from './controllers/athlete.controller';
import { AthletePostgresRepository } from 'src/infra/databases/orms/prisma/postgres/repositories/athlete.repository';
import { BucketModule } from '../buckets/bucket.module';
import { InjuryModule } from '../injury/injury.module';
import { PainModule } from '../pain/pain.module';
import { ClubModule } from '../club/club.module';

@Module({
  controllers: [AthleteController],
  imports: [
    BucketModule,
    ClubModule,
    MulterModule,
    forwardRef(() => InjuryModule),
    forwardRef(() => PainModule),
  ],
  providers: [
    CreateAthleteUseCase,
    ListAthletesUseCase,
    FindAthleteUseCase,
    UpdateAthleteStatusUseCase,
    UpdateAthleteUseCase,
    GetAllAthletesUseCase,
    {
      provide: 'IAthleteRepository',
      useClass: AthletePostgresRepository,
    },
  ],
  exports: ['IAthleteRepository'],
})
export class AthleteModule {}
