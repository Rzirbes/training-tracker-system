import { Module } from '@nestjs/common';
import { UnsubscribeController } from './unsubscribe.controller';
import { UnsubscribeUseCase } from './unsubscribe.usecase';
import { UnsubscribePostgresRepository } from 'src/infra/databases/orms/prisma/postgres/repositories/unsubscribe-repository';

@Module({
  controllers: [UnsubscribeController],
  providers: [
    UnsubscribeUseCase,
    {
      provide: 'IUnsubscribeRepository',
      useClass: UnsubscribePostgresRepository,
    },
  ],
  exports: ['IUnsubscribeRepository'],
})
export class UnsubscribeModule {}
