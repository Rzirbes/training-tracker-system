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
import { AuthGuard } from '@nestjs/passport';
import { Guards } from '../../auth';
import {
  CreateTrainingTypeUseCase,
  FindTrainingTypeUseCase,
  GetAllTrainingTypesUseCase,
  ListTrainingTypeUseCase,
  UpdateTrainingTypeStatusUseCase,
  UpdateTrainingTypeUseCase,
} from '../usecases';
import {
  CreateTrainingTypeDto,
  UpdateDefaultTrainingTypeDto,
  UpdateTrainingTypeDto,
} from '../dtos';
import { PaginateRequestDto, Roles, UserRoleEnum } from 'src/app/shared';
import { UpdateDefaultTrainingTypeUseCase } from '../usecases/update-default-training-type.usecase';

@Controller('training-types')
export class TrainingTypeController {
  constructor(
    private readonly updateTrainingType: UpdateTrainingTypeUseCase,
    private readonly updateTrainingTypeStatus: UpdateTrainingTypeStatusUseCase,
    private readonly findTrainingType: FindTrainingTypeUseCase,
    private readonly createTrainingType: CreateTrainingTypeUseCase,
    private readonly listTrainingType: ListTrainingTypeUseCase,
    private readonly getAllTrainingTypes: GetAllTrainingTypesUseCase,
    private readonly updateDefaultTrainingTypeUseCase: UpdateDefaultTrainingTypeUseCase,
  ) {}

  @Post('default')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.ADMIN)
  async updateDefault(@Body() body: UpdateDefaultTrainingTypeDto) {
    return this.updateDefaultTrainingTypeUseCase.execute(body);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.ADMIN)
  async create(@Body() body: Omit<CreateTrainingTypeDto, 'coachId'>) {
    await this.createTrainingType.execute(body);
    return { message: 'Tipo de Treino criado com sucesso!' };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.ADMIN)
  async list(@Query() query: PaginateRequestDto) {
    return await this.listTrainingType.execute(query);
  }

  @Get('all')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.COLLABORATOR)
  async getAll() {
    return await this.getAllTrainingTypes.execute();
  }

  @Get(':uuid')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.ADMIN)
  async find(@Param('uuid') uuid: string) {
    return await this.findTrainingType.execute(uuid);
  }

  @Patch(':uuid/update-status')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.ADMIN)
  async updateStatus(@Param('uuid') uuid: string) {
    await this.updateTrainingTypeStatus.execute(uuid);
    return { message: 'Status do tipo de treino atualizado com sucesso!' };
  }

  @Put(':uuid')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.ADMIN)
  async update(
    @Param('uuid') uuid: string,
    @Body() body: UpdateTrainingTypeDto,
  ) {
    await this.updateTrainingType.execute({ uuid, ...body });
    return { message: 'Tipo de treino atualizado com sucesso!' };
  }
}
