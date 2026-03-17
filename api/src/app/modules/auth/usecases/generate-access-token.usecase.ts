import { JwtService } from '@nestjs/jwt';
import { JwtPayloadDto } from '../dtos';
import { ConfigService } from '@nestjs/config';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { IBaseUseCase } from 'src/app/shared';

@Injectable()
export class GenerateAccessTokenUseCase implements IBaseUseCase {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  public async execute(payload: JwtPayloadDto): Promise<string> {
    const expiresInRaw = this.config.get<string>('JWT_EXPIRATION');
    const expiresIn = Number(expiresInRaw);

    if (!expiresInRaw || Number.isNaN(expiresIn) || expiresIn <= 0) {
      throw new InternalServerErrorException(
        `JWT_EXPIRATION inválido: ${expiresInRaw}`,
      );
    }

    return this.jwtService.signAsync(payload, {
      expiresIn,
    });
  }
}
