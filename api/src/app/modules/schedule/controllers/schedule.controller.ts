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
import { AuthGuard } from '@nestjs/passport';
import { Guards } from '../../auth';
import {
  CreateAbsenceScheduleDto,
  CreateScheduleDto,
  FindSchedulesRequestDto,
  UpdateAbsenceScheduleDto,
  UpdateScheduleDto,
} from '../dtos';
import {
  CreateScheduleUseCase,
  FindSchedulesUseCase,
  UpdateScheduleUseCase,
  AthleteConfirmScheduleUseCase,
  CancelScheduleUseCase,
  FindScheduleByUuidUseCase,
  AthleteCancelScheduleUseCase,
  DeleteScheduleUseCase,
  CreateAbsenceScheduleUseCase,
  UpdateAbsenceScheduleUseCase,
  DeleteAbsenceScheduleUseCase,
} from '../usecases';
import { GetUserAuth, Roles, UserRoleEnum } from 'src/app/shared';
import { UserEntity } from '../../user';

@Controller('schedule')
export class ScheduleController {
  constructor(
    private readonly createScheduleUseCase: CreateScheduleUseCase,
    private readonly findSchedulesUseCase: FindSchedulesUseCase,
    private readonly updateScheduleUseCase: UpdateScheduleUseCase,
    private readonly athleteConfirmScheduleUseCase: AthleteConfirmScheduleUseCase,
    private readonly cancelScheduleUseCase: CancelScheduleUseCase,
    private readonly deleteScheduleUseCase: DeleteScheduleUseCase,
    private readonly findScheduleByUuidUseCase: FindScheduleByUuidUseCase,
    private readonly athleteCancelScheduleUseCase: AthleteCancelScheduleUseCase,
    private readonly createAbsenceScheduleUseCase: CreateAbsenceScheduleUseCase,
    private readonly updateAbsenceScheduleUseCase: UpdateAbsenceScheduleUseCase,
    private readonly deleteAbsenceScheduleUseCase: DeleteAbsenceScheduleUseCase,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.COLLABORATOR)
  async find(
    @Query() query: FindSchedulesRequestDto,
    @GetUserAuth() user: UserEntity,
  ) {
    return this.findSchedulesUseCase.execute(query, user);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.ADMIN)
  async create(@Body() body: CreateScheduleDto) {
    return this.createScheduleUseCase.execute(body);
  }

  @Post('/block-time')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.ADMIN)
  async createAbsence(@Body() body: CreateAbsenceScheduleDto) {
    return this.createAbsenceScheduleUseCase.execute(body);
  }

  @Put('/block-time/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.ADMIN)
  async updateAbsence(
    @Param() { id }: { id: string },
    @Body() body: UpdateAbsenceScheduleDto,
  ) {
    return this.updateAbsenceScheduleUseCase.execute(id, body);
  }

  @Delete('/block-time/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.ADMIN)
  async deleteAbsence(@Param() { id }: { id: string }) {
    return this.deleteAbsenceScheduleUseCase.execute(id);
  }

  @Patch(':id/cancel/from/athlete')
  @HttpCode(HttpStatus.OK)
  async cancelFromAthlete(@Param() { id }: { id: string }) {
    return this.athleteCancelScheduleUseCase.execute(id);
  }

  @Patch(':id/confirm/from/athlete')
  @HttpCode(HttpStatus.OK)
  async confirm(@Param() { id }: { id: string }) {
    return this.athleteConfirmScheduleUseCase.execute(id);
  }

  @Patch(':id/cancel')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.COLLABORATOR)
  async cancel(@Param() { id }: { id: string }) {
    return this.cancelScheduleUseCase.execute(id);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.ADMIN)
  async findById(@Param() { id }: { id: string }) {
    return this.findScheduleByUuidUseCase.execute(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.ADMIN)
  async delete(@Param() { id }: { id: string }) {
    return this.deleteScheduleUseCase.execute(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.ADMIN)
  async findByUuid(
    @Param() { id }: { id: string },
    @Body() body: UpdateScheduleDto,
  ) {
    return this.updateScheduleUseCase.execute({ ...body, id });
  }
}
