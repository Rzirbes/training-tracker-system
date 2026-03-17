import { Global, Module } from '@nestjs/common';
import { PrismaPGService } from './postgres';

@Global()
@Module({
  providers: [PrismaPGService],
  exports: [PrismaPGService],
})
export class PrismaModule {}
