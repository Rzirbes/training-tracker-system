import { AuthGuard } from '@nestjs/passport';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Guards } from '../../auth';
import {
  CreateCoachDto,
  GetCoachesDto,
  GetCoachesRequestDto,
  UpdateCoachDto,
} from '../dtos';
import {
  CreateCoachUseCase,
  FindCoachUseCase,
  GetAllCoachesUseCase,
  GetCoachesUseCase,
  UpdateCoachStatusUseCase,
  UpdateCoachUseCase,
} from '../usecases';
import {
  PaginateResponseDto,
  Roles,
  UserRoleEnum,
  type IBaseResponse,
} from 'src/app/shared';

@Controller('coaches')
export class CoachController {
  constructor(
    private readonly createUserUseCase: CreateCoachUseCase,
    private readonly getUsersUseCase: GetCoachesUseCase,
    private readonly updateCoachStatusUseCase: UpdateCoachStatusUseCase,
    private readonly findCoachUseCase: FindCoachUseCase,
    private readonly updateCoachUseCase: UpdateCoachUseCase,
    private readonly getAllCoachesUseCase: GetAllCoachesUseCase,
  ) {}

  @Get('')
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  async list(
    @Query() query: GetCoachesRequestDto,
  ): Promise<PaginateResponseDto<GetCoachesDto>> {
    return this.getUsersUseCase.execute(query);
  }

  @Post('')
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  async create(@Body() body: CreateCoachDto): Promise<IBaseResponse> {
    await this.createUserUseCase.execute(body);
    return {
      title: 'Colaborador cadastrado com sucesso!',
      message: 'Enviamos o e-mail de definição da senha para o colaborador.',
    };
  }

  @Get('all')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.ADMIN)
  async findAll() {
    return await this.getAllCoachesUseCase.execute();
  }

  @Patch(':uuid/update-status')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.ADMIN)
  async updateStatus(@Param('uuid') uuid: string) {
    return await this.updateCoachStatusUseCase.execute(uuid);
  }

  @Put(':uuid')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.ADMIN)
  async update(@Param('uuid') uuid: string, @Body() body: UpdateCoachDto) {
    return await this.updateCoachUseCase.execute({ uuid, ...body });
  }

  @Get(':uuid')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.ADMIN)
  async find(@Param('uuid') uuid: string) {
    return await this.findCoachUseCase.execute(uuid);
  }
}
