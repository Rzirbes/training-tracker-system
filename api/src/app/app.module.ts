import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MulterModule } from '@nestjs/platform-express';
import { SentryGlobalFilter, SentryModule } from '@sentry/nestjs/setup';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from 'src/infra/databases/orms/prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { QueueModule } from './modules/queues/queue.module';
import { SecurityModule } from 'src/infra/security/security.module';
import { AthleteModule } from './modules/athlete/athlete.module';
import { TrainingTypeModule } from './modules/training-type/training-type.module';
import { TrainingPlanningModule } from './modules/training-planning/training-planning.module';
import { TrainingModule } from './modules/training/training.module';
import { MonitoringModule } from './modules/monitory/monitoring.module';
import { CronModule } from './modules/cron/cron.module';
import { UnsubscribeModule } from './modules/unsubscribe/unsubscribe.module';
import { CityModule } from './modules/city/city.module';
import { StateModule } from './modules/state/state.module';
import { CoachModule } from './modules/coaches/coach.module';
import { ScheduleModule } from './modules/schedule/schedule.module';
import { InjuryModule } from './modules/injury/injury.module';
import { PainModule } from './modules/pain/pain.module';
import { CountryModule } from './modules/country/contry.module';
import { BucketModule } from './modules/buckets/bucket.module';
import { ClubModule } from './modules/club/club.module';

@Module({
  imports: [
    SentryModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    EventEmitterModule.forRoot({
      wildcard: true,
      global: true,
    }),
    MulterModule.register({}),
    QueueModule,
    UserModule,
    PrismaModule,
    SecurityModule,
    CronModule,
    AthleteModule,
    TrainingTypeModule,
    TrainingPlanningModule,
    TrainingModule,
    MonitoringModule,
    UnsubscribeModule,
    CityModule,
    StateModule,
    CountryModule,
    CoachModule,
    ScheduleModule,
    InjuryModule,
    PainModule,
    BucketModule,
    ClubModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
    AppService,
  ],
})
export class AppModule {}
