import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  CreateTrainingDto,
  DeleteTrainingDto,
  FindTrainingRequestDto,
  ListTrainingRequestDto,
  UpdateTrainingDto,
} from '../dtos';
import { AuthGuard } from '@nestjs/passport';
import { Guards } from 'src/app/modules/auth';
import {
  CreateTrainingUseCase,
  DeleteTrainingUseCase,
  FindTrainingUseCase,
  ListTrainingUseCase,
  UpdateTrainingUseCase,
} from '../usecases';
import { Roles, UserRoleEnum } from 'src/app/shared';

@Controller('trainings')
export class TrainingController {
  constructor(
    private readonly createTrainingUseCase: CreateTrainingUseCase,
    private readonly listTrainingUseCase: ListTrainingUseCase,
    private readonly deleteTrainingUseCase: DeleteTrainingUseCase,
    private readonly updateTrainingUseCase: UpdateTrainingUseCase,
    private readonly findTrainingUseCase: FindTrainingUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.COLLABORATOR)
  async create(@Body() body: CreateTrainingDto) {
    await this.createTrainingUseCase.execute(body);
    return { message: 'Treino criado com sucesso!' };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.COLLABORATOR)
  async list(@Query() query: ListTrainingRequestDto) {
    return await this.listTrainingUseCase.execute(query);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.COLLABORATOR)
  async update(@Body() body: UpdateTrainingDto) {
    await this.updateTrainingUseCase.execute(body);
    return { message: 'Treino atualizado com sucesso!' };
  }

  @Delete(':uuid')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.ADMIN)
  async delete(@Param() { uuid }: DeleteTrainingDto) {
    await this.deleteTrainingUseCase.execute(uuid);
    return { message: 'Treino removido com sucesso!' };
  }

  @Get(':uuid')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.COLLABORATOR)
  async findByUuid(@Param() { uuid }: FindTrainingRequestDto) {
    return this.findTrainingUseCase.execute(uuid);
  }
}
