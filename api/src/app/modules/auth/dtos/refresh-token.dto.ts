import { IsString, IsUUID } from 'class-validator';

export class RefreshTokenRequestDto {
  @IsString()
  @IsUUID('4')
  refreshToken: string;
}

export class RefreshTokenResponseDto {
  @IsString()
  @IsUUID('4')
  token: string;
}
