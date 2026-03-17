import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IUserRepository } from '../user/repositories/user.repository';
import { JwtRequestPayloadDto } from './dtos';
import { TokenExpiredException } from './exceptions';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  public async validate(payload: JwtRequestPayloadDto) {
    const { userId } = await this.validateJwt(payload);
    const user = await this.userRepository.findById(userId);

    if (!user) {
      const message = 'Não autorizado!';
      throw new UnauthorizedException(message);
    }

    return user;
  }

  private async validateJwt(payload: JwtRequestPayloadDto) {
    const expirationTimeInMilliSeconds = payload.exp * 1000;
    const tokenExpirationDate = new Date(expirationTimeInMilliSeconds);
    const nowDate = new Date();

    if (tokenExpirationDate < nowDate) {
      const title = 'Autenticação expirou!';
      const message = 'Faça o login novamente...';
      throw new TokenExpiredException(title, message);
    }

    return payload;
  }
}
