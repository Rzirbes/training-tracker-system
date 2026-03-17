import { Module } from '@nestjs/common';
import { ScheduleModule as NestScheduleModule } from '@nestjs/schedule';
import { NestjsSchedulerRepository } from './nestjs-scheduler.repository';
import { MonitoringModule } from '../monitory/monitoring.module';
import { ScheduleModule } from '../schedule/schedule.module';

@Module({
  imports: [NestScheduleModule.forRoot(), MonitoringModule, ScheduleModule],
  providers: [
    {
      provide: 'ICronRepository',
      useClass: NestjsSchedulerRepository,
    },
  ],
})
export class CronModule {}
