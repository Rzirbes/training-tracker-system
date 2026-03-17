import { forwardRef, Module } from '@nestjs/common';
import { PainController } from './controllers';
import { PainPostgresRepository } from 'src/infra/databases/orms/prisma/postgres/repositories/pain.repository';
import { AthleteModule } from '../athlete/athlete.module';
import {
  CreatePainUseCase,
  DeletePainUseCase,
  FindPainUseCase,
  ListPainUseCase,
  UpdatePainUseCase,
} from './usecases';


@Module({
  controllers: [PainController],
  imports: [forwardRef(() => AthleteModule)],
  providers: [
    CreatePainUseCase,
    ListPainUseCase, 
    DeletePainUseCase,
    FindPainUseCase,
    UpdatePainUseCase,
     {
      provide: 'IPainRepository',
      useClass: PainPostgresRepository
    }
  ],
  exports: ['IPainRepository'],
})
export class PainModule {}
