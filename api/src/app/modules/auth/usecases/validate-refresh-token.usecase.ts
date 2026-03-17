import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenExpiredException } from '../exceptions';
import { JwtPayloadDto } from '../dtos';
import { TokenEntity } from '../entities';
import type { IUserRepository } from '../../user/repositories/user.repository';
import type { IRefreshTokenRepository } from '../repositories';
import type { IBaseUseCase } from 'src/app/shared';

@Injectable()
export class ValidateRefreshTokenUseCase implements IBaseUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IRefreshTokenRepository')
    private readonly tokenRepository: IRefreshTokenRepository,
  ) {}

  public async execute(refreshToken: string): Promise<JwtPayloadDto> {
    const token = await this.getRefreshToken(refreshToken);
    const userId = token.getUserId();
    const user = await this.userRepository.findById(userId);

    if (!user) {
      const title = 'Usuário não encontrado!';
      const message = 'Autentique-se novamente...';
      throw new UnauthorizedException({ title, message });
    }

    return {
      type: user.getRole(),
      userId,
    };
  }

  private async getRefreshToken(refreshToken: string): Promise<TokenEntity> {
    const token = await this.tokenRepository.findByToken(refreshToken);

    if (!token) {
      const title = 'Token não encontrado!';
      const message = 'Autentique-se novamente...';
      throw new UnauthorizedException({ title, message });
    }

    await this.validateToken(token);

    return token;
  }

  private async validateToken(token: TokenEntity) {
    const today = new Date();
    const tokenExpired = token.getExpiresIn() < today;
    const invalidToken = !token.getIsValid();

    if (tokenExpired || invalidToken) {
      const title = 'Login expirado!';
      const message = 'Faça a autenticação novamente...';
      throw new TokenExpiredException(title, message);
    }
  }
}
