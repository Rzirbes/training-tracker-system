import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import {
  CreateStateDto,
  CreateStateResponseDto,
  GetStatesResponseDto,
} from '../dtos';
import { CreateStateUseCase, GetStatesByCountryUseCase } from '../usecases';

@Controller('states')
export class StateController {
  constructor(
    private readonly createStateUseCase: CreateStateUseCase,
    private readonly getStatesUseCase: GetStatesByCountryUseCase,
  ) {}

  @Get()
  async getStates(
    @Query('countryId') countryId,
  ): Promise<GetStatesResponseDto> {
    return this.getStatesUseCase.execute(countryId);
  }

  @Post()
  async createState(
    @Body() country: CreateStateDto,
  ): Promise<CreateStateResponseDto> {
    return this.createStateUseCase.execute(country);
  }
}
