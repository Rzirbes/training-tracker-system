import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Guards } from '../../auth';
import {
  CaptureAthleteWellBeingDto,
  CreateDayWellBeingDto,
  GetDayWellBeingRequestDto,
  GetInjuryDashboardRequestDto,
  GetInjuryDashboardResponseDto,
  GetPainDashboardRequestDto,
  GetPainDashboardResponseDto,
  GetWellBeingMonitoringRequestDto,
  UpdateDayWellBeingDto,
  UpdateDayWellBeingParamDto,
  WeekMonitoringRequestDto,
} from '../dtos';
import {
  GetWeekMonitoringUseCase,
  MonotonyMonitoringUseCase,
  CaptureAthleteWellBeingUseCase,
  GetWellBeingMonitoringUseCase,
  GetInjuryDashboardUseCase,
  SendWellBeingToAthletesUseCase,
  GetDayWellBeingUseCase,
  CreateDayWellBeingUseCase,
  UpdateDayWellBeingUseCase,
  GetPainDashboardUseCase,
} from '../usecases';
import { Roles, UserRoleEnum } from 'src/app/shared';

@Controller('monitoring')
export class MonitoringController {
  constructor(
    private readonly GetWeekMonitoringUseCase: GetWeekMonitoringUseCase,
    private readonly monotonyMonitoringUseCase: MonotonyMonitoringUseCase,
    private readonly captureAthleteWellBeingUseCase: CaptureAthleteWellBeingUseCase,
    private readonly getWellBeingMonitoringUseCase: GetWellBeingMonitoringUseCase,
    private readonly getInjuryDashboardUseCase: GetInjuryDashboardUseCase,
    private readonly getPainDashboardUseCase: GetPainDashboardUseCase,
    private readonly sendWellBeingToAthletesUseCase: SendWellBeingToAthletesUseCase,
    private readonly getDayWellBeingUseCase: GetDayWellBeingUseCase,
    private readonly createDayWellBeingUseCase: CreateDayWellBeingUseCase,
    private readonly updateDayWellBeingUseCase: UpdateDayWellBeingUseCase,
  ) {}

  @Get('week')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.COLLABORATOR)
  async week(@Query() query: WeekMonitoringRequestDto) {
    return await this.GetWeekMonitoringUseCase.execute(query);
  }

  @Get('monotony')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.COLLABORATOR)
  async monotony(@Query() query: WeekMonitoringRequestDto) {
    return await this.monotonyMonitoringUseCase.execute(query);
  }

  @Post('well-being')
  @HttpCode(HttpStatus.CREATED)
  async captureAthleteWellBeing(@Body() body: CaptureAthleteWellBeingDto) {
    return await this.captureAthleteWellBeingUseCase.execute(body);
  }

  @Get('well-being')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.COLLABORATOR)
  async getWellBeingMonitory(@Query() query: GetWellBeingMonitoringRequestDto) {
    return await this.getWellBeingMonitoringUseCase.execute(query);
  }

  @Get('injury')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.COLLABORATOR)
  async getInjuryDashboard(
    @Query() query: GetInjuryDashboardRequestDto,
  ): Promise<GetInjuryDashboardResponseDto> {
    return this.getInjuryDashboardUseCase.execute(query);
  }

  @Post('well-being/notification')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.COLLABORATOR)
  async notificationWellBeing() {
    try {
      await this.sendWellBeingToAthletesUseCase.execute();
      return {
        message:
          'Notificação de Bem-estar enviada com sucesso para os atletas!',
      };
    } catch (_) {
      return {
        message:
          'Não foi possível enviar a notificação de Bem-estar para os atletas!',
      };
    }
  }

  @Get('well-being/day')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.COLLABORATOR)
  async getDayWellBeing(@Query() query: GetDayWellBeingRequestDto) {
    return await this.getDayWellBeingUseCase.execute(query);
  }

  @Post('well-being/day')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.COLLABORATOR)
  async createDayWellBeing(@Body() body: CreateDayWellBeingDto) {
    return this.createDayWellBeingUseCase.execute(body);
  }

  @Put('well-being/:uuid')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.COLLABORATOR)
  async UpdateDayWellBeing(
    @Param() { uuid }: UpdateDayWellBeingParamDto,
    @Body() body: UpdateDayWellBeingDto,
  ) {
    return this.updateDayWellBeingUseCase.execute(uuid, body);
  }

  @Get('pain')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.COLLABORATOR)
  async getPainDashboard(
    @Query() query: GetPainDashboardRequestDto,
  ): Promise<GetPainDashboardResponseDto> {
    return this.getPainDashboardUseCase.execute(query);
  }
}
