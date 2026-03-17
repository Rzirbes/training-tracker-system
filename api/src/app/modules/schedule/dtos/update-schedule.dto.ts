import { Type } from 'class-transformer';
import {
  IsDate,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class TrainingPlanningDto {
  @IsUUID('4', {
    message: 'Identificação do Tipo de Treino inválido.',
  })
  @IsString({
    message: 'Identificação do Tipo de Treino não é uma string válida.',
  })
  trainingTypeId: string;

  @IsNumber({}, { message: 'Duração do Treino não é um número válido.' })
  duration: number;

  @IsNumber({}, { message: 'PSE não é um número válido.' })
  pse: number;

  @IsString({ message: 'Descrição do Planejamento não é uma string válida' })
  @IsOptional()
  description?: string;
}

export class UpdateScheduleDto {
  id: string;

  @Type(() => Date)
  @IsDate({ message: 'Data de início do agendamento inválida.' })
  start: Date;

  @Type(() => Date)
  @IsDate({ message: 'Data de fim do agendamento inválida.' })
  end: Date;

  @IsUUID('4', {
    message: 'Identificação do Treinador inválida.',
  })
  @IsString()
  coachId: string;

  @IsObject({
    message: 'Planejamento de carga do atleta inválido.',
  })
  trainingPlanning: TrainingPlanningDto;
}
