import { IsString, IsUUID } from 'class-validator';

export class FinishTrainingPlanningDto {
  @IsUUID('4', {
    message: 'Identificação do Treino inválida.',
  })
  @IsString({ message: 'Identificação do Treino não é uma string válida.' })
  uuid: string;
}
