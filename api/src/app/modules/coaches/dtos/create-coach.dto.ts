import { Type } from 'class-transformer';
import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { AddressDto } from 'src/app/shared';

export class CreateCoachDto {
  @Length(1, 255, {
    message: 'Nome deve ter menos que 255 caracteres.',
  })
  @IsString({ message: 'Nome  é obrigatório' })
  name: string;

  @Length(1, 255, {
    message: 'E-mail deve ter menos que 255 caracteres.',
  })
  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  @Length(0, 255, {
    message: 'Cargo deve ter menos que 255 caracteres.',
  })
  @IsString({ message: 'Cargo inválido' })
  @IsOptional()
  role: string;

  @IsOptional()
  @IsString({ message: 'Celular inválido' })
  @MaxLength(18, { message: 'Celular deve ter no máximo 18 caracteres' })
  phone?: string;

  @Type(() => AddressDto)
  @IsOptional()
  address: AddressDto;

  @IsString({ message: 'Cor do calendário é obrigatório' })
  schedulerColor: string;
}
