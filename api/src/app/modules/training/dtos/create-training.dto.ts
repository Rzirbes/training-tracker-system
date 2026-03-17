import {
  IsString,
  IsDate,
  IsNumber,
  IsOptional,
  IsUUID,
  IsArray,
  ValidateNested,
  MaxLength,
} from 'class-validator';
import { PainDto } from '../../pain/dtos';
import { Type } from 'class-transformer';
import { InjuryDto } from '../../injury/dtos';

export class CreateTrainingDto {
  @IsUUID('4', {
    message: 'Identificação do Atleta inválida.',
  })
  @IsString({ message: 'Identificação do Atleta não é uma string válida.' })
  athleteUuid: string;

  @IsDate({ message: 'Data Treino Planejado inválida.' })
  @Type(() => Date)
  date: Date;

  @IsUUID('4', {
    message: 'Identificação do Tipo de Treino inválido.',
  })
  @IsString({
    message: 'Identificação do Tipo de Treino não é uma string válida.',
  })
  trainingTypeUuid: string;

  @IsNumber({}, { message: 'Duração do Treino não é um número válido.' })
  duration: number;

  @IsNumber({}, { message: 'PSE não é um número válido.' })
  pse: number;

  @IsNumber({}, { message: 'PSR não é um número válido.' })
  psr: number;

  @IsString({ message: 'Descrição do Treino não é uma string válida' })
  @IsOptional()
  @MaxLength(2000, {
    message: 'Descrição não deve ter mais que 2000 caracteres.',
  })
  description?: string;

  @IsUUID('4', {
    message: 'Identificação do planejamento de treino inválido.',
  })
  @IsString({
    message: 'Identificação do planejamento de treino não é uma string válida.',
  })
  @IsOptional()
  trainingPlanningUuid?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => InjuryDto)
  injuries: InjuryDto[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PainDto)
  pains: PainDto[];
}
