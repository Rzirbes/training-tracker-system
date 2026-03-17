import { IsString, IsUUID } from 'class-validator';

export class FindTrainingPlanningRequestDto {
  @IsUUID('4', {
    message: 'Identificação do Atleta inválida.',
  })
  @IsString({ message: 'Identificação do Atleta não é uma string válida.' })
  uuid: string;
}

export class FindTrainingPlanningResponseDto {
  id: string;
  date: Date;
  trainingType: {
    id: string;
    name: string;
  };
  duration: number;
  pse: number;
  description?: string;
  load: number;
  finished: boolean;
}
