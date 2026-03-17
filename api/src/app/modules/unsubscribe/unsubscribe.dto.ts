import { IsEmail, IsString, IsUUID } from 'class-validator';

export class UnsubscribeDto {
  @IsUUID('4')
  @IsString()
  token: string;

  @IsString()
  @IsEmail()
  email: string;
}
