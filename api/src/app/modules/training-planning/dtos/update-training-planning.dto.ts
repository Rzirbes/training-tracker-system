import { Type } from 'class-transformer';
import {
  IsString,
  IsDate,
  IsNumber,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class UpdateTrainingPlanningDto {
  @IsUUID('4', {
    message: 'Identificação do Treino inválida.',
  })
  @IsString({ message: 'Identificação do Treino não é uma string válida.' })
  trainingUuid: string;

  @Type(() => Date)
  @IsDate({ message: 'Data Treino Planejado inválida.' })
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

  @IsString({ message: 'Descrição do Planejamento não é uma string válida' })
  @IsOptional()
  description?: string;
}
