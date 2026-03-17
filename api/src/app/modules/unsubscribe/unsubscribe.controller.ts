import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UnsubscribeUseCase } from './unsubscribe.usecase';
import { UnsubscribeDto } from './unsubscribe.dto';
import type { IBaseResponse } from 'src/app/shared';

@Controller('unsubscribe')
export class UnsubscribeController {
  constructor(private readonly unsubscribeUseCase: UnsubscribeUseCase) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async unsubscribe(@Body() body: UnsubscribeDto): Promise<IBaseResponse> {
    return await this.unsubscribeUseCase.execute(body);
  }
}
