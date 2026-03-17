import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  CreatePasswordDto,
  ForgotPasswordDto,
  LoginRequestDto,
  LoginResponseDto,
} from '../dtos';
import {
  GenerateRefreshTokenUseCase,
  GenerateAccessTokenUseCase,
  LoginUseCase,
  CreatePasswordUseCase,
  ForgotPasswordUseCase,
  ValidateRefreshTokenUseCase,
} from '../usecases';
import { IBaseResponse } from 'src/app/shared';
import {
  RefreshTokenRequestDto,
  RefreshTokenResponseDto,
} from '../dtos/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly createPasswordUseCase: CreatePasswordUseCase,
    private readonly generateRefreshToken: GenerateRefreshTokenUseCase,
    private readonly generateAccessToken: GenerateAccessTokenUseCase,
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    private readonly validateRefreshTokenUseCase: ValidateRefreshTokenUseCase,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginRequestDto): Promise<LoginResponseDto> {
    const user = await this.loginUseCase.execute(body);

    const [token, refreshToken] = await Promise.all([
      this.generateAccessToken.execute({
        type: user.getRole(),
        userId: user.getId(),
      }),
      this.generateRefreshToken.execute(user.getId()),
    ]);

    return {
      token,
      refreshToken,
      user: {
        name: user.getName(),
        uuid: user.getUuid(),
        type: user.getRole(),
      },
    };
  }

  @Post('create-password')
  @HttpCode(HttpStatus.CREATED)
  async createPassword(
    @Body() body: CreatePasswordDto,
  ): Promise<IBaseResponse> {
    await this.createPasswordUseCase.execute(body);
    return {
      title: 'Senha cadastrada com sucesso!',
      message: 'Acesse a plataforma...',
    };
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(
    @Body() body: ForgotPasswordDto,
  ): Promise<IBaseResponse> {
    await this.forgotPasswordUseCase.execute(body);
    return {
      title: 'Recuperação de senha solicitada!',
      message:
        'Você recebera um e-mail em instantes com os próximos passo para recuperação...',
    };
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.CREATED)
  async getAccessToken(
    @Body() { refreshToken }: RefreshTokenRequestDto,
  ): Promise<RefreshTokenResponseDto> {
    const jwtPayload =
      await this.validateRefreshTokenUseCase.execute(refreshToken);
    const token = await this.generateAccessToken.execute(jwtPayload);
    return {
      token,
    };
  }
}
