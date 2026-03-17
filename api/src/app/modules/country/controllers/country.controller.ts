import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateCountryUseCase, GetCountriesUseCase } from '../usecases';
import { CreateCountryDto, CreateCountryResponseDto, GetCountriesResponseDto } from '../dtos';

@Controller('countries')
export class CountryController {
  constructor(
    private readonly createCountryUseCase: CreateCountryUseCase,
    private readonly getCountriesUseCase: GetCountriesUseCase,
  ) {}

  @Get()
  async getCountries(@Query('all') all): Promise<GetCountriesResponseDto> {
    const isAll = all === 'true' ? true : false;
    return this.getCountriesUseCase.execute(isAll);
  }

  @Post()
  async createCountry(@Body() body: CreateCountryDto): Promise<CreateCountryResponseDto> {
    return this.createCountryUseCase.execute(body);
  }
}
