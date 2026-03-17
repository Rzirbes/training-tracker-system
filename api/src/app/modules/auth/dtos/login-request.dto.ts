import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginRequestDto {
  @IsEmail({}, { message: 'E-mail ou senha incorretos...' })
  email: string;

  @MinLength(8, { message: 'E-mail ou senha incorretos...' })
  @IsString()
  password: string;
}
