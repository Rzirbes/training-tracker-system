import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import {
  CreateCityDto,
  CreateCityResponseDto,
  GetCitiesRequestDto,
  GetCitiesResponseDto,
} from '../dtos';
import { GetCitiesByStateUseCase } from '../usecases/get-cities-by-state.usecase';
import { CreateCityUseCase } from '../usecases';

@Controller('cities')
export class CityController {
  constructor(
    private readonly getCitiesByStateUseCase: GetCitiesByStateUseCase,
    private readonly createCityUseCase: CreateCityUseCase,
  ) {}

  @Get()
  async getCities(
    @Query() request: GetCitiesRequestDto,
  ): Promise<GetCitiesResponseDto> {
    return this.getCitiesByStateUseCase.execute(request?.state);
  }

  @Post()
  async createCity(
    @Body() body: CreateCityDto,
  ): Promise<CreateCityResponseDto> {
    return this.createCityUseCase.execute(body);
  }
}
