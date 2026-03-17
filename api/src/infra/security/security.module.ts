import { Module } from '@nestjs/common';
import { BcryptRepository } from './hash/bcrypt.repository';

@Module({
  providers: [
    {
      provide: 'ISecurityRepository',
      useClass: BcryptRepository,
    },
  ],
  exports: ['ISecurityRepository'],
})
export class SecurityModule {}
