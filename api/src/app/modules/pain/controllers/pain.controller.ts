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
  CreatePainsDto,
  GetPainRequestDto,
  PainDto,
  ListPainRequestDto,
  DeletePainDto
} from '../dtos';
import { AuthGuard } from '@nestjs/passport';
import { Roles, UserRoleEnum } from 'src/app/shared';
import { Guards } from 'src/app/modules/auth';
import {
  CreatePainUseCase,
  DeletePainUseCase,
  FindPainUseCase,
  ListPainUseCase,
  UpdatePainUseCase
} from '../usecases';

@Controller('pains')
export class PainController {
  constructor(
    private readonly listPainUseCase: ListPainUseCase,
    private readonly createPainUseCase: CreatePainUseCase,
    private readonly deletePainUseCase: DeletePainUseCase,
    private readonly findPainUseCase: FindPainUseCase,
    private readonly updatePainUseCase: UpdatePainUseCase,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.COLLABORATOR)
  async list(@Query() query: ListPainRequestDto) {
    return await this.listPainUseCase.execute(query);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.COLLABORATOR)
  async create(@Body() body: CreatePainsDto) {
    const { message } = await this.createPainUseCase.execute(body);
    return { message };
  }

  @Delete(':uuid')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.ADMIN)
  async delete(@Param() { uuid }: DeletePainDto) {
    const { message } = await this.deletePainUseCase.execute({ uuid });
    return { message };
  }

  @Put(':uuid')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.ADMIN)
  async update(@Param() { uuid }: GetPainRequestDto, @Body() body: PainDto) {
    const { message } = await this.updatePainUseCase.execute(uuid, body);
    return { message };
  }

  @Get(':uuid')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'), Guards.roles)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.COLLABORATOR)
  async findByUuid(@Param() { uuid }: GetPainRequestDto) {
    return this.findPainUseCase.execute(uuid);
  }
}
