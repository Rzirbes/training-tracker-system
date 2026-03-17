import { Module, forwardRef } from '@nestjs/common';
import { QueueModule } from '../queues/queue.module';
import { SecurityModule } from 'src/infra/security/security.module';
import { UserPostgresRepository } from 'src/infra/databases/orms/prisma/postgres';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    QueueModule,
    forwardRef(() => AuthModule),
    forwardRef(() => SecurityModule),
  ],
  providers: [
    {
      provide: 'IUserRepository',
      useClass: UserPostgresRepository,
    },
  ],
  exports: ['IUserRepository'],
})
export class UserModule {}
