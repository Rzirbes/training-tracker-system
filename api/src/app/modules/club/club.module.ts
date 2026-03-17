import { Module } from '@nestjs/common';
import { ClubController } from './controllers';
import { CreateClubUseCase, GetClubsUseCase } from './usecases';
import { ClubPostgresRepository } from 'src/infra/databases/orms/prisma/postgres/repositories/club.repository';

@Module({
  controllers: [ClubController],
  providers: [
    CreateClubUseCase,
    GetClubsUseCase,
    {
      provide: 'IClubRepository',
      useClass: ClubPostgresRepository,
    },
  ],
  exports: ['IClubRepository'],
})
export class ClubModule {}
