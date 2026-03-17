import {
  Body,
  Controller,
  Delete,
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
import {
  CreateTrainingPlanningDto,
  DeleteTrainingPlanningDto,
  ListTrainingPlanningRequestDto,
  FinishTrainingPlanningDto,
  UpdateTrainingPlanningDto,
  FindTrainingPlanningRequestDto,
} from '../dtos';
import { AuthGuard } from '@nestjs/passport';
import { Guards } from 'src/app/modules/auth';
import {
  CreateTrainingPlanningUseCase,
  DeleteTrainingPlanningUseCase,
  ListTrainingPlanningUseCase,
  FinishTrainingPlanningUseCase,
  UpdateTrainingPlanningUseCase,
  FindTrainingPlanningUseCase,
} from '../usecases';
import { Roles, UserRoleEnum } from 'src/app/shared';

@Controller('training-planning')
export class TrainingPlanningController {
  constructor(
    private readonly createTrainingPlanningUseCase: CreateTrainingPlanningUseCase,
    private readonly updateTrainingPlanningUseCase: UpdateTrainingPlanningUseCase,
    private readonly listTrainingPlanningUseCase: ListTrainingPlanningUseCase,
    private readonly deleteTrainingPlanningUseCase: DeleteTrainingPlanningUseCase,
    private readonly finishTrainingPlanningUseCase: FinishTrainingPlanningUseCase,
    private readonly findTrainingPlanningUseCase: FindTrainingPlanningUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.ADMIN)
  async create(@Body() body: CreateTrainingPlanningDto) {
    await this.createTrainingPlanningUseCase.execute(body);
    return { message: 'Planejamento do treino criado com sucesso!' };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.COLLABORATOR)
  async list(@Query() query: ListTrainingPlanningRequestDto) {
    return await this.listTrainingPlanningUseCase.execute(query);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.ADMIN)
  async update(@Body() body: UpdateTrainingPlanningDto) {
    await this.updateTrainingPlanningUseCase.execute(body);
    return { message: 'Planejamento do treino atualizado com sucesso!' };
  }

  @Patch(':uuid/finish')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.ADMIN)
  async finish(@Param() { uuid }: FinishTrainingPlanningDto) {
    await this.finishTrainingPlanningUseCase.execute(uuid);
    return { message: 'Planejamento do treino finalizado com sucesso!' };
  }

  @Delete(':uuid')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.ADMIN)
  async delete(@Param() { uuid }: DeleteTrainingPlanningDto) {
    await this.deleteTrainingPlanningUseCase.execute(uuid);
    return { message: 'Planejamento do treino removido com sucesso!' };
  }

  @Get(':uuid')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.COLLABORATOR)
  async findByUuid(@Param() { uuid }: FindTrainingPlanningRequestDto) {
    return this.findTrainingPlanningUseCase.execute(uuid);
  }
}
