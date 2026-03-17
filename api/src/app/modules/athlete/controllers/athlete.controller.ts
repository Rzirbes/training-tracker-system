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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaginateRequestDto, Roles, UserRoleEnum } from 'src/app/shared';
import {
  CreateAthleteUseCase,
  FindAthleteUseCase,
  GetAllAthletesUseCase,
  ListAthletesUseCase,
  UpdateAthleteStatusUseCase,
  UpdateAthleteUseCase,
} from '../usecases';
import {
  CreateAthleteDto,
  ListAthletesRequestDto,
  UpdateAthleteDto,
} from '../dtos';
import { Guards } from '../../auth/guards';

@Controller('athletes')
export class AthleteController {
  constructor(
    private readonly createAthleteUseCase: CreateAthleteUseCase,
    private readonly listAthletesUseCase: ListAthletesUseCase,
    private readonly findAthleteUseCase: FindAthleteUseCase,
    private readonly updateAthleteStatusUseCase: UpdateAthleteStatusUseCase,
    private readonly updateAthleteUseCase: UpdateAthleteUseCase,
    private readonly getAllAthletesUseCase: GetAllAthletesUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.ADMIN)
  @UseInterceptors(FileInterceptor('avatar'))
  async create(
    @Body() body: CreateAthleteDto,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    await this.createAthleteUseCase.execute({
      ...body,
      avatar,
    });
    return { message: 'Atleta criado com sucesso!' };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.ADMIN)
  async list(@Query() query: ListAthletesRequestDto) {
    return await this.listAthletesUseCase.execute({
      ...query,
    });
  }

  @Get('all')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.COLLABORATOR)
  async findAll() {
    return await this.getAllAthletesUseCase.execute();
  }

  @Get(':uuid')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.COLLABORATOR)
  async find(@Param('uuid') uuid: string) {
    return await this.findAthleteUseCase.execute(uuid);
  }

  @Patch(':uuid/update-status')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.ADMIN)
  async updateStatus(@Param('uuid') uuid: string) {
    return await this.updateAthleteStatusUseCase.execute(uuid);
  }

  @Put(':uuid')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.ADMIN)
  @UseInterceptors(FileInterceptor('avatar'))
  async update(
    @Param('uuid') uuid: string,
    @UploadedFile() avatar: Express.Multer.File,
    @Body() body: UpdateAthleteDto,
  ) {
    return await this.updateAthleteUseCase.execute({ ...body, uuid, avatar });
  }
}
