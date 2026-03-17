import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import {
  CreateClubRequestDto,
  CreateClubResponseDto,
  GetClubsRequestDto,
  GetClubsResponseDto
} from '../dtos';
import { CreateClubUseCase, GetClubsUseCase } from '../usecases';

@Controller('clubs')
export class ClubController {
  constructor(
    private readonly createClubUseCase: CreateClubUseCase,
    private readonly getClubsUseCase: GetClubsUseCase,
  ) {}

  @Get()
  async getClubs(
    @Query() query: GetClubsRequestDto,
  ): Promise<GetClubsResponseDto> {
    return this.getClubsUseCase.execute(query);
  }

  @Post()
  async createClub(
    @Body() body: CreateClubRequestDto,
  ): Promise<CreateClubResponseDto> {
    return this.createClubUseCase.execute(body);
  }
}
