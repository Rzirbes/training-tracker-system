import { Module } from '@nestjs/common';
import { QueueSQSRepository } from 'src/infra';

@Module({
  providers: [
    {
      provide: 'IQueueRepository',
      useClass: QueueSQSRepository,
    },
  ],
  exports: ['IQueueRepository'],
})
export class QueueModule {}
