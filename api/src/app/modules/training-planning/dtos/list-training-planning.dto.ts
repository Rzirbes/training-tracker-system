import { Type } from 'class-transformer';
import { IsDate, IsString, IsUUID } from 'class-validator';

class TrainingPlanning {
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

export class ListTrainingPlanningRequestDto {
  @IsUUID('4', {
    message: 'Identificação do Atleta inválida.',
  })
  @IsString({ message: 'Identificação do Atleta não é uma string válida.' })
  athleteUuid: string;

  @Type(() => Date)
  @IsDate({ message: 'Data de inicial inválida.' })
  startDate: Date;

  @Type(() => Date)
  @IsDate({ message: 'Data de final inválida.' })
  endDate: Date;
}

export class ListTrainingPlanningResponseDto {
  trainingPlanning: TrainingPlanning[];
  charge: {
    week: number;
    previousWeek: number;
    nextWeek: number;
  };
  trainingTotals: {
    week: number;
    previousWeek: number;
    nextWeek: number;
  };
}
