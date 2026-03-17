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
  CreateInjuriesDto,
  GetInjuryRequestDto,
  InjuryDto,
ListInjuryRequestDto
} from '../dtos';
import { AuthGuard } from '@nestjs/passport';
import { Guards } from 'src/app/modules/auth';
import {
  CreateInjuryUseCase,
  DeleteInjuryUseCase,
  FindInjuryUseCase,
  ListInjuryUseCase,
  UpdateInjuryUseCase
} from '../usecases';
import { Roles, UserRoleEnum } from 'src/app/shared';
import { DeleteInjuryDto } from '../dtos/delete-injury.dto';

@Controller('injuries')
export class InjuryController {
  constructor(
    private readonly listInjuryUseCase: ListInjuryUseCase,
    private readonly createInjuryUseCase: CreateInjuryUseCase,
    private readonly deleteInjuryUseCase: DeleteInjuryUseCase,
    private readonly findInjuryUseCase: FindInjuryUseCase,
    private readonly updateInjuryUseCase: UpdateInjuryUseCase,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.COLLABORATOR)
  async list(@Query() query: ListInjuryRequestDto) {
    return await this.listInjuryUseCase.execute(query);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.COLLABORATOR)
  async create(@Body() body: CreateInjuriesDto) {
    const { message } = await this.createInjuryUseCase.execute(body);
    return { message };
  }

  @Delete(':uuid')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.ADMIN)
  async delete(@Param() { uuid }: DeleteInjuryDto) {
    const { message } = await this.deleteInjuryUseCase.execute({ uuid });
    return { message };
  }

  @Put(':uuid')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.ADMIN)
  async update(
    @Param() { uuid }: GetInjuryRequestDto,
    @Body() body: InjuryDto,
  ) {
    const { message } = await this.updateInjuryUseCase.execute(uuid, body);
    return { message };
  }

  @Get(':uuid')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.COLLABORATOR)
  async findByUuid(@Param() { uuid }: GetInjuryRequestDto) {
    return this.findInjuryUseCase.execute(uuid);
  }
}
