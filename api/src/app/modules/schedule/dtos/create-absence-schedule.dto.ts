import { Type } from 'class-transformer';
import {
  IsDate,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateAbsenceScheduleDto {
  @Type(() => Date)
  @IsDate({ message: 'Data de início da ausência inválida.' })
  start: Date;

  @Type(() => Date)
  @IsDate({ message: 'Data de fim da ausência inválida.' })
  end: Date;

  @IsUUID('4', {
    message: 'Identificação do Treinador inválida.',
  })
  @IsString()
  coachId: string;

  @IsString({ message: 'Descrição não é uma string válida.' })
  @MinLength(3, { message: 'Descrição deve ter no mínimo 3 caracteres.' })
  @MaxLength(255, { message: 'Descrição deve ter no máximo 255 caracteres.' })
  description: string;
}
